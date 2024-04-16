"use client";

import { AppShell, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { KitchenMain, LogoWithLink, LogoutButton, ThemeToggle } from "@/components";
import { getOrderItems, getUserCookies } from "@/services";
import { orderItems, userType } from "@/models";
import { mapToOrderItems, noPermissionToast } from "@/helpers";
import { siteRoute } from "@/constants";

export default function Kitchen() {
  const router = useRouter();

  const [orderItemList, setOrderItemList] = useState([] as orderItems[]);
  const [isOrderItemListLoading, setOrderItemListLoading] = useState(true);

  const refreshOrderList = () => {
    setOrderItemListLoading(true);
    getOrderItems().then((res) => {
      setOrderItemList(mapToOrderItems(res));
      setOrderItemListLoading(false);
    });
  };

  /* Fetches every second. Uncomment for demo. */
  useEffect(() => {
    const intervalId = setInterval(refreshOrderList, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getUserCookies().then((res) => {
      const permittedUsers = new RegExp(`${userType.manager}|${userType.kitchenStaff}`);
      if (res && (res.isSuperUser === "true" || permittedUsers.test(res.groups || ""))) refreshOrderList();
      else {
        noPermissionToast();
        router.push(siteRoute.auth);
      };
    });
  }, [router]);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className="navbar">
          <Flex className="w-100" align="center">
            <LogoWithLink />
          </Flex>
          <Flex gap="sm">
            <ThemeToggle />
            <LogoutButton />
          </Flex>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <KitchenMain
          orderItemList={orderItemList}
          isLoading={isOrderItemListLoading}
          onRefresh={refreshOrderList}
        />
      </AppShell.Main>
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
    </AppShell>
  );
}
