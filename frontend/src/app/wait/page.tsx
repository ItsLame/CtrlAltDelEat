"use client";

import { WaitMain } from "@/components/wait";
import { siteRoute } from "@/constants";
import { assistRequests, Items, userType } from "@/models";
import { getUserCookies, getWaitAssistance, getWaitItemsToServe } from "@/services";
import { AppShell, Image } from "@mantine/core";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Wait() {
  const router = useRouter();
  const [custAssistReq, setCustAssistReq] = useState([] as assistRequests[]);
  const [tempAssistReq, setTempAssistReq] = useState([] as assistRequests[]);

  const [tempServeReq, setTempServeReq] = useState([] as Items[]);
  const [serveRequests, setServeRequests] = useState([] as Items[]);

  const refreshServeList = () => {
    getWaitItemsToServe().then((res) => {
      setTempServeReq(res);
    });
  };

  useEffect(() => {
    const filtered = tempServeReq.filter((item) => item.status === "prepared");
    setServeRequests(filtered);
  }, [tempServeReq]);

  const refreshAssistList = () => {
    getWaitAssistance().then((res) => {
      setTempAssistReq(res);
    });
  };

  useEffect(() => {
    const filtered = tempAssistReq.filter(
      (item) => item.request_assistance === true
    );
    setCustAssistReq(filtered);
  }, [tempAssistReq]);

  const refreshAllList = useCallback(() => {
    refreshAssistList();
    refreshServeList();
  }, []);

  useEffect(() => {
    getUserCookies().then((res) => {
      if (res && (res.isSuperUser || res.groups?.includes(userType.waitStaff))) refreshAllList();
      else router.push(siteRoute.auth);
    });
  }, [refreshAllList, router]);

  useEffect(() => {
    const intervalId = setInterval(refreshAssistList, 5000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const intervalId = setInterval(refreshServeList, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className="navbar">
          <Image
            className="logo"
            src="logo.svg"
            h={45}
            alt="CtrlAltDelEat Logo"
          />
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <WaitMain
          serveItemsReqs={serveRequests}
          custAssistReqs={custAssistReq}
          refreshAssist={refreshAssistList}
          refreshServe={refreshServeList}
        />
      </AppShell.Main>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
    </AppShell>
  );
}
