"use client";

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ActionIcon, AppShell, Flex, Image, Select, Text } from "@mantine/core";

import { getCategories, getMenuItems } from "@/services";
import { category, menuItems } from "@/models";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerMain } from "@/components/customer/CustomerMain";
import { ViewMenuItemModal } from "@/components";
import { BellIcon } from "@radix-ui/react-icons";

export default function Customer({ params: { tableNo } } : { params: { tableNo: number } }) {
  const [sidebarOpened] = useDisclosure();
  const [viewMenuItemModalOpened, { open, close }] = useDisclosure(false);

  const [category, setCategory] = useState({} as category);
  const [menuItem, setMenuItem] = useState({} as menuItems);
  const [filteredItemList, updateItems] = useState([] as menuItems[]);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);
  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);

  const handleSelectCategory = (category?: category) => {
    if (category) {
      setCategory(category);
      const items = menuItemList.filter((item) => item.category.includes(category.url));
      updateItems(items);
    }
  };

  const handleSelectMenuItem = (menuItem: menuItems) => {
    setMenuItem(menuItem);
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
          <Flex align="center" gap="sm" flex={1}>
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
            <Select
              hiddenFrom="sm"
              size="sm"
              w={120}
              value={category.category_name}
              data={categoryList.map(c => c.category_name)}
              onChange={(e) => {handleSelectCategory(categoryList.find(c => c.category_name == e));}}
            />
          </Flex>
          <Flex justify="flex-end" mr={20}>
            <ActionIcon><BellIcon /></ActionIcon>
          </Flex>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <CustomerSidebar
          category={category}
          categoryList={categoryList}
          isLoading={isCategoryListLoading}
          onCategorySelect={handleSelectCategory}
          onRefresh={refreshCategoryList}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <CustomerMain
          category={category}
          items={filteredItemList}
          onMenuItemSelect={handleSelectMenuItem}
          onViewMenuItem={open}
        />
      </AppShell.Main>

      <ViewMenuItemModal
        menuItem={menuItem}
        tableNo={tableNo}
        isOpened={viewMenuItemModalOpened}
        isLoading={isMenuItemListLoading}
        onClose={close}
        onSubmit={refreshMenuList}
      />
    </AppShell>
  );
}
