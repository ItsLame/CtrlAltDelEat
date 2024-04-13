"use client";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ActionIcon, AppShell, Flex, Image, Select, Text } from "@mantine/core";

import { getCartStatus, getCategories, getMenuItems } from "@/services";
import { cartView, category, menuItems } from "@/models";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerMain } from "@/components/customer/CustomerMain";
import { ViewMenuItemModal } from "@/components";
import { BellIcon, ReaderIcon } from "@radix-ui/react-icons";
import { ViewCartModal } from "@/components/customer/ViewCartModal";
import toast, { Toaster } from "react-hot-toast";
import { requestAssistance } from "@/services/customer";

export default function Customer({ params: { tableNo } }: { params: { tableNo: number } }) {
  const isMobile = useMediaQuery("(max-width: 495px)");

  const [sidebarOpened] = useDisclosure();
  const [viewMenuItemModalOpened, { open, close }] = useDisclosure(false);
  const [addMenuItemModalOpened, { open: openCartModal, close: closeCartModal }] = useDisclosure(false);

  const [category, setCategory] = useState({} as category);
  const [menuItem, setMenuItem] = useState({} as menuItems);
  const [filteredItemList, updateItems] = useState([] as menuItems[]);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);
  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);
  const [cartItems, setCartItems] = useState([] as cartView[]);
  const [isCartLoading, { toggle }] = useDisclosure(false);

  const handleSelectCategory = (category?: category) => {
    if (category) {
      setCategory(category);
      const items = menuItemList.filter((item) => item.category.includes(category.url));
      updateItems(items);
    }
  };

  const handleRequestForAssistance = () => {
    requestAssistance(tableNo).then((res) => {
      switch (res) {
      case 201:
        toast.custom("Requested for assitance");
        break;
      default:
        toast.error("Error, failed to request assistance");
        break;
      }
    });
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

  useEffect(() => {
    const fetchData = async () => {
      const cart = await getCartStatus(tableNo);
      setCartItems(cart);
      toggle();
    };

    if (isCartLoading) {
      fetchData().catch(() => console.error("there was an error loading cart"));
    }
  }, [cartItems, isCartLoading, tableNo, toggle]);

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
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
      <AppShell.Header>
        <div className="navbar">
          <Flex align="center" gap="sm" flex={1}>
            <Image
              className="logo"
              src="/logo.svg"
              h={isMobile ? 25 : 45}
              alt="CtrlAltDelEat Logo"
            />
            <Text className="table-number" fw={700} c="dark" size={isMobile ? "xs" : "md"}>
              Table #{tableNo}
            </Text>
            <Select
              hiddenFrom="sm"
              size="sm"
              className="w-75"
              value={category.category_name}
              data={categoryList.map((c) => c.category_name)}
              onChange={(e) => handleSelectCategory(categoryList.find((c) => c.category_name == e))}
              mr="md"
            />
          </Flex>
          <Flex justify="flex-end" mr={20} columnGap="sm">
            <ActionIcon
              onClick={() => {
                toggle();
                openCartModal();
              }}>
              <ReaderIcon/>
            </ActionIcon>
            <ActionIcon onClick={handleRequestForAssistance} >
              <BellIcon/>
            </ActionIcon>
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

      <ViewCartModal
        isLoading={isCartLoading}
        tableNo={tableNo}
        isOpen={addMenuItemModalOpened}
        onClose={closeCartModal}
        cartItems={cartItems}
      />
    </AppShell>
  );
}
