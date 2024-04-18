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

  const [custAssistReqs, setcustAssistReqs] = useState([] as assistRequests[]);
  const [tempAssistReq, setTempAssistReq] = useState([] as assistRequests[]);
  const [toAssist, setToAssist] = useState([] as assistRequests[]);

  const [serveItemsReqs, setserveItemsReqs] = useState([] as items[]);
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

  const addAssistInProgress = (num: number, timestamp: string) => {
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
    if (type === statusType.serving && itemID === num) return false;
    else return true;
  };

  const checkAssist = (num: number, itemTableNum: number, type: string) => {
    if (type === statusType.assist && itemTableNum === num) return false;
    else return true;
  };

  const updateItemStatusToServed = (serveItemId: number) => {
    const itemID = serveItemId;
    updateItemStatus(itemID, statusType.served).then(refreshServe);
  };

  const updateAssistance = (num: number) => {
    updateWaitAssistance(num);
  };

  const deleteServeNoUpdate = (serveItemId: number) => {
    serveLock.current = true;
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
  };

  const deleteAssistNoUpdate = (num: number) => {
    assistLock.current = true;
    serveLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkAssist(num, item.tableNumber, item.reqType)));
  };

  const deleteServeInProgress = (serveItemId: number, serveTable:number) => {
    toast.success(`Served Table No: ${serveTable}, Item No: ${serveItemId}!`);
    updateItemStatusToServed(serveItemId);
    serveLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
  };

  const deleteAssistInProgress = (num: number) => {
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
    if (serveLock.current) {
      let orderToServe = serveItemsReqs
        .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
        .filter((item1) => !allInProgress.some((item2) => item1.id === item2.itemID));
      setToServe(orderToServe);
      serveLock.current = false;
    }
  }, [allInProgress, serveItemsReqs]);

  useEffect(() => {
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
    setserveItemsReqs(filteredServeReq);
  }, [tempServeReq]);

  useEffect(() => {
    const filteredAssistReq = tempAssistReq.filter((item) => item.request_assistance === true);
    setcustAssistReqs(filteredAssistReq);
  }, [tempAssistReq]);

  useEffect(() => {
    /* Fetches every second. */
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
          addAssistToProgress={addAssistInProgress}
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
