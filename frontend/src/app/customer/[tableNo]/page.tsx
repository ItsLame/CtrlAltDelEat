"use client";

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AppShell, Burger, Image, Text } from "@mantine/core";

import { getCategories, getMenuItems } from "@/services";
import { category, menuItems } from "@/models";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerMain } from "@/components/customer/CustomerMain";

export default function Customer({ params: { tableNo } } : { params: { tableNo: number } }) {
  const [sidebarOpened, { toggle }] = useDisclosure();

  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState({} as category);
  const [filteredItemList, updateItems] = useState([] as menuItems[]);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);
  // eslint-disable-next-line no-unused-vars
  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);

  const handleSelectCategory = (category: category) => {
    setCategory(category);
    const items = menuItemList.filter((item) => item.category.includes(category.url));
    updateItems(items);
  };

  const refreshMenuList = () => {
    setMenuItemListLoading(true);
    getMenuItems().then((res) => {
      setMenuItemList(res);
      setMenuItemListLoading(false);
    });
  };

  const refreshCategoryList = () => {
    setCategoryListLoading(true);
    getCategories().then((res) => {
      setCategoryList(res);
      setCategoryListLoading(false);
    });
  };

  useEffect(() => {
    refreshCategoryList();
    refreshMenuList();
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !sidebarOpened },
      }}
      padding="md"
    >
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
          <Text fw={700} c="dark">
            Table #{tableNo}
          </Text>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <CustomerSidebar
          onCategorySelect={handleSelectCategory}
          categoryList={categoryList}
          isLoading={isCategoryListLoading}
          onRefresh={refreshCategoryList}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <CustomerMain
          items={filteredItemList}
          tableNo={tableNo}
        />
      </AppShell.Main>
    </AppShell>
  );
}
