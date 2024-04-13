"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { KitchenMain } from "@/components";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { getOrderItems, getUserGroupName } from "@/services";
import { orderItems, userType } from "@/models";
import { mapToOrderItems } from "@/helpers";
import { siteRoute } from "@/constants";

export default function Kitchen() {
  const router = useRouter();
  const [sidebarOpened, { toggle }] = useDisclosure();

  const [orderItemList, setOrderItemList] = useState([] as orderItems[]);
  const [isOrderItemListLoading, setOrderItemListLoading] = useState(true);

  const refreshOrderList = () => {
    setOrderItemListLoading(true);
    getOrderItems().then((res) => {
      setOrderItemList(mapToOrderItems(res));
      setOrderItemListLoading(false);
    });
  };

  useEffect(() => {
    getUserGroupName().then((res: userType[]) => {
      if (res && res.includes(userType.kitchenStaff)) refreshOrderList();
      else router.push(siteRoute.auth);
    });
  }, [router]);

  useEffect(() => {
    const intervalId = setInterval(refreshOrderList, 7000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className="navbar">
          <Burger
            className="burger"
            opened={sidebarOpened}
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

      <AppShell.Main>
        <KitchenMain
          orderItemList={orderItemList}
          isLoading={isOrderItemListLoading}
          onRefresh={refreshOrderList}
        />
      </AppShell.Main>
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
    </AppShell>
  );
}
