"use client";

import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { KitchenMain, LogoWithLink, LogoutButton, ThemeToggle } from "@/components";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { getOrderItems, getUserCookies } from "@/services";
import { orderItems, userType } from "@/models";
import { mapToOrderItems, noPermissionToast } from "@/helpers";
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
    getUserCookies().then((res) => {
      const permittedUsers = new RegExp(`${userType.manager}|${userType.kitchenStaff}`);
      if (res && (res.isSuperUser === "true" || permittedUsers.test(res.groups || ""))) refreshOrderList();
      else {
        noPermissionToast();
        router.push(siteRoute.auth);
      };
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
          <Flex className="w-100" align="center">
            <Burger
              className="burger"
              opened={sidebarOpened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <LogoWithLink />
          </Flex>
          <Flex gap="sm">
            <LogoutButton />
            <ThemeToggle />
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
