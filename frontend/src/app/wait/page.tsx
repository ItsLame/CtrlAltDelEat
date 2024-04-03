"use client";

import { WaitMain } from "@/components/wait";
import { assistRequests } from "@/models";
import { getWaitAssistance } from "@/services";
import { AppShell } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Wait() {
  const [custAssistReq, setCustAssistReq] = useState([] as assistRequests[]);
  const [tempAssistReq, setTempAssistReq] = useState([] as assistRequests[]);

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

  useEffect(() => {
    refreshAssistList();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(refreshAssistList, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className="navbar">
          <Image
            className="logo"
            src="logo.svg"
            width={100}
            height={60}
            alt="CtrlAltDelEat Logo"
          />
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <WaitMain
          custAssistReqs={custAssistReq}
          refreshFunc={refreshAssistList}
        />
      </AppShell.Main>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
    </AppShell>
  );
}
