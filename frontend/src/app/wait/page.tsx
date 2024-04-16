"use client";

import { AppShell, Burger, Divider, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { LogoWithLink, LogoutButton, ThemeToggle, InProgress, ReadyToServe, RequestAssistance } from "@/components";
import { getUserCookies, getWaitAssistance, getWaitItemsToServe, updateItemStatus, updateWaitAssistance } from "@/services";
import { assistRequests, bothrequests, Items, statusType, userType } from "@/models";
import { siteRoute } from "@/constants";
import { noPermissionToast } from "@/helpers";

export default function Wait() {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  const [custAssistReqs, setcustAssistReqs] = useState([] as assistRequests[]);
  const [tempAssistReq, setTempAssistReq] = useState([] as assistRequests[]);

  const [tempServeReq, setTempServeReq] = useState([] as Items[]);
  const [serveItemsReqs, setserveItemsReqs] = useState([] as Items[]);

  const [allInProgress, setAllInProgress] = useState([] as bothrequests[]);
  const [toAssist, setToAssist] = useState([] as assistRequests[]);
  const assistLock = useRef(false);

  const [toServe, setToServe] = useState([] as Items[]);
  const serveLock = useRef(false);

  const refreshServe = () => getWaitItemsToServe().then((res) => setTempServeReq(res));

  useEffect(() => {
    const filtered = tempServeReq.filter((item) => item.status === statusType.prepared);
    setserveItemsReqs(filtered);
  }, [tempServeReq]);

  const refreshAssist = () => {
    getWaitAssistance().then((res) => setTempAssistReq(res));
  };

  useEffect(() => {
    const filtered = tempAssistReq.filter((item) => item.request_assistance === true);
    setcustAssistReqs(filtered);
  }, [tempAssistReq]);

  const refreshAllList = useCallback(() => {
    refreshAssist();
    refreshServe();
  }, []);

  /* Fetches every second. Uncomment for demo. */
  useEffect(() => {
    const assistIntervalId = setInterval(refreshAssist, 1000);
    const serveIntervalId = setInterval(refreshServe, 1000);

    return () => {
      clearInterval(assistIntervalId);
      clearInterval(serveIntervalId);
    };
  }, []);

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
    if (assistLock.current) {
      const tableToAssist = custAssistReqs.filter((item) => item.request_assistance &&
        !allInProgress.some((i) => item.tableNumber === i.tableNumber && i.reqType === statusType.assist));
      setToAssist(tableToAssist);
      assistLock.current = false;
    }
  }, [allInProgress, custAssistReqs]);

  useEffect(() => {
    assistLock.current = true;
  }, [custAssistReqs]);

  useEffect(() => {
    if (serveLock.current) {
      let filteredArray = serveItemsReqs.filter((item1) => !allInProgress.some((item2) => item1.id === item2.itemID));
      setToServe(filteredArray);
      serveLock.current = false;
    }
  }, [allInProgress, serveItemsReqs]);

  useEffect(() => {
    serveLock.current = true;
  }, [serveItemsReqs]);

  const addServeItemToInProgress = (serveItem: Items) => {
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

  const checkServe = (num: number, itemID: number, type: string) => {
    if (type === statusType.serving && itemID === num) return false;
    else return true;
  };

  const delServeNoUpdate = (serveItemId: number) => {
    serveLock.current = true;
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
  };

  const updateItemStatusToServed = (serveItemId: number) => {
    const itemID = serveItemId;
    updateItemStatus(itemID, statusType.served).then(refreshServe);
  };

  const deleteServeInProgress = (serveItemId: number, serveTable:number) => {
    toast.success(`Served Table No: ${serveTable}, Item No: ${serveItemId}!`);
    updateItemStatusToServed(serveItemId);
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkServe(serveItemId, item.itemID, item.reqType)));
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

  const checkAssist = (num: number, itemTableNum: number, type: string) => {
    if (type === statusType.assist && itemTableNum === num) return false;
    else return true;
  };

  const delAssistNoUpdate = (num: number) => {
    assistLock.current = true;
    serveLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkAssist(num, item.tableNumber, item.reqType)));
  };

  const updateAssistance = (num: number) => {
    updateWaitAssistance(num);
  };

  const deleteAssistInProgress = (num: number) => {
    toast.success(`Assisted Table No: ${num}!`);
    updateAssistance(num);
    assistLock.current = false;
    setAllInProgress((prev) => prev.filter((item) => checkAssist(num, item.tableNumber, item.reqType)));
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{
      width: 400,
      breakpoint: "sm",
      collapsed: { mobile: !opened }
    }}
    padding="md" >
      <AppShell.Header>
        <div className="navbar">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" px="lg"/>
          <Flex className="w-100" align="center">
            <LogoWithLink />
          </Flex>
          <Flex gap="sm">
            <ThemeToggle />
            <LogoutButton />
          </Flex>
        </div>
      </AppShell.Header>

      <AppShell.Navbar >
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
          assistUndo={delAssistNoUpdate}
          assistUpdate={deleteAssistInProgress}
          serveUndo={delServeNoUpdate}
          serveUpdate={deleteServeInProgress}
          refreshAssist={refreshAssist}
          refreshServe={refreshServe}
        />
      </AppShell.Main>
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
    </AppShell>
  );
}
