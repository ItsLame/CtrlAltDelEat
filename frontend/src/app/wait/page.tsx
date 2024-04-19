"use client";

import { AppShell, Burger, Divider, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { LogoWithLink, LogoutButton, ThemeToggle, InProgress, ReadyToServe, RequestAssistance } from "@/components";
import { getUserCookies, getWaitAssistance, getWaitItemsToServe, updateItemStatus, updateWaitAssistance } from "@/services";
import { assistRequests, serveAssistRequests, items, statusType, userType } from "@/models";
import { siteRoute } from "@/constants";
import { noPermissionToast } from "@/helpers";

export default function Wait() {
  const router = useRouter();
  const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure();

  const [custAssistReqs, setCustAssistReqs] = useState([] as assistRequests[]);
  const [tempAssistReq, setTempAssistReq] = useState([] as assistRequests[]);
  const [toAssist, setToAssist] = useState([] as assistRequests[]);

  const [serveItemsReqs, setServeItemsReqs] = useState([] as items[]);
  const [tempServeReq, setTempServeReq] = useState([] as items[]);
  const [toServe, setToServe] = useState([] as items[]);

  const [allInProgress, setAllInProgress] = useState([] as serveAssistRequests[]);

  const serveLock = useRef(false);
  const assistLock = useRef(false);

  const refreshServe = () => getWaitItemsToServe().then((res) => setTempServeReq(res));
  const refreshAssist = () => getWaitAssistance().then((res) => setTempAssistReq(res));

  const refreshAllList = useCallback(() => {
    refreshAssist();
    refreshServe();
  }, []);

  const addServeItemToInProgress = (serveItem: items) => {
    /* Creates new serveAssistRequest to add serve item to 'In Progress' section */

    const newReq = {
      reqType: statusType.serving,
      tableNumber: serveItem.tableNumber,
      itemID: serveItem.id,
      timestamp: serveItem.timestamp,
      itemName: serveItem.itemName,
      quantity: serveItem.quantity,
      alterations: serveItem.alterations,
    };

    serveLock.current = true;
    assistLock.current = false;
    setAllInProgress((prev) => [...prev, newReq]);
  };

  const addAssistToInProgress = (num: number, timestamp: string) => {
    /* Creates new serveAssistRequest to add assist request to 'In Progress' section */

    const newReq = {
      reqType: statusType.assist,
      tableNumber: num,
      itemID: -1,
      timestamp: timestamp,
      itemName: "",
      quantity: -1,
      alterations: "",
    };

    assistLock.current = true;
    serveLock.current = false;
    setAllInProgress((prev) => [...prev, newReq]);
  };

  const checkServe = (num: number, itemID: number, type: string) => {
    /*
     * Check which item card to remove from 'Ready To Serve based on
     * if the item is being served.
     */

    if (type === statusType.serving && itemID === num) return false;
    else return true;
  };

  const checkAssist = (num: number, itemTableNum: number, type: string) => {
    /*
     *  Check which assist card to remove from Request Assistance
     *  based on if the table is being assisted.
     */

    if (type === statusType.assist && itemTableNum === num) return false;
    else return true;
  };

  const updateItemStatusToServed = (serveItemId: number) => {
    /* Send request to backend to mark item as served */

    const itemID = serveItemId;
    updateItemStatus(itemID, statusType.served).then(refreshServe);
  };

  const updateAssistance = (num: number) => {
    /* Send request to backend to mark assistance as complete */

    updateWaitAssistance(num);
  };

  const deleteServeNoUpdate = (serveItemId: number) => {
    /* Only remove from 'In Progess'; does not send any request to backend */

    serveLock.current = true;
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
  };

  const deleteAssistNoUpdate = (num: number) => {
    /* Only remove from 'In Progess'; does not send any request to backend */

    assistLock.current = true;
    serveLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkAssist(num, item.tableNumber, item.reqType)));
  };

  const deleteServeInProgress = (serveItemId: number, serveTable:number) => {
    /* Remove from 'In Progress'; send request to backend to mark as complete */

    toast.success(`Served Table No: ${serveTable}, Item No: ${serveItemId}!`);
    updateItemStatusToServed(serveItemId);
    serveLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
  };

  const deleteAssistInProgress = (num: number) => {
    /* Remove from 'In Progress'; send request to backend to mark as complete */

    toast.success(`Assisted Table No: ${num}!`);
    updateAssistance(num);
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkAssist(num, item.tableNumber, item.reqType)));
  };

  useEffect(() => {
    getUserCookies().then((res) => {
      const permittedUsers = new RegExp(`${userType.manager}|${userType.waitStaff}`);
      if (res && (res.isSuperUser === "true" || permittedUsers.test(res.groups || ""))) refreshAllList();
      else {
        noPermissionToast();
        router.push(siteRoute.auth);
      }
    });
  }, [refreshAllList, router]);

  useEffect(() => {
    /* When serve item request list has been modified:
     * - filter those requests that are currently 'In Progress'
     * - sort all items according to timestamp.
     */

    if (serveLock.current) {
      let orderToServe = serveItemsReqs
        .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
        .filter((item1) => !allInProgress.some((item2) => item1.id === item2.itemID));
      setToServe(orderToServe);
      serveLock.current = false;
    }
  }, [allInProgress, serveItemsReqs]);

  useEffect(() => {
    /* When assistance request list has been modified:
     * - filter those requests that are currently 'In Progress'
     * - sort all items according to timestamp.
     */

    if (assistLock.current) {
      const tableToAssist = custAssistReqs
        .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
        .filter((item) => item.request_assistance &&
          !allInProgress.some((i) => item.tableNumber === i.tableNumber && i.reqType === statusType.assist));
      setToAssist(tableToAssist);
      assistLock.current = false;
    }
  }, [allInProgress, custAssistReqs]);

  useEffect(() => {
    serveLock.current = true;
  }, [serveItemsReqs]);

  useEffect(() => {
    assistLock.current = true;
  }, [custAssistReqs]);

  useEffect(() => {
    const filteredServeReq = tempServeReq.filter((item) => item.status === statusType.prepared);
    setServeItemsReqs(filteredServeReq);
  }, [tempServeReq]);

  useEffect(() => {
    const filteredAssistReq = tempAssistReq.filter((item) => item.request_assistance === true);
    setCustAssistReqs(filteredAssistReq);
  }, [tempAssistReq]);

  useEffect(() => {
    /* Fetches incomming serve+assist requests every second. */
    const assistIntervalId = setInterval(refreshAssist, 1000);
    const serveIntervalId = setInterval(refreshServe, 1000);

    return () => {
      clearInterval(assistIntervalId);
      clearInterval(serveIntervalId);
    };
  }, []);

  useEffect(() => {
    document.title = "CtrlAltDelEat - Wait";
  }, []);

  return (
    <AppShell header={{ height: 60 }}
      navbar={{
        width: 400,
        breakpoint: "sm",
        collapsed: { mobile: !sidebarOpened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <div className="navbar">
          <Burger opened={sidebarOpened} onClick={toggleSidebar} hiddenFrom="sm" size="sm" px="lg"/>
          <Flex className="w-100" align="center">
            <LogoWithLink />
          </Flex>
          <Flex gap="sm">
            <ThemeToggle />
            <LogoutButton />
          </Flex>
        </div>
      </AppShell.Header>

      <AppShell.Navbar>
        <ReadyToServe
          allRequests={toServe}
          addToServeInProgress={addServeItemToInProgress}
        />
        <Divider my="sm" />
        <RequestAssistance
          allRequests={toAssist}
          addToAssistInProgress={addAssistToInProgress}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <InProgress
          allRequests={allInProgress}
          assistUndo={deleteAssistNoUpdate}
          assistUpdate={deleteAssistInProgress}
          serveUndo={deleteServeNoUpdate}
          serveUpdate={deleteServeInProgress}
          refreshAssist={refreshAssist}
          refreshServe={refreshServe}
        />
      </AppShell.Main>
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
    </AppShell>
  );
}
