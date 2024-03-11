"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";

import { ManagerSidebar } from "@/components";
import { Toaster } from "react-hot-toast";

export default function Manager() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <div className="navbar">
          <Burger
            className="burger"
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Image
            className="logo"
            src="logo.svg"
            width={100}
            height={60}
            alt="CtrlAltDelEat Logo"
          />
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ManagerSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        Menu items here
      </AppShell.Main>

      <Toaster position="top-right" toastOptions={{ duration: 1000 }}/>
    </AppShell>
  );
}
