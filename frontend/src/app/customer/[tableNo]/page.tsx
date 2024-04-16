"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ActionIcon, AppShell, Flex, Image, Paper, Select, Text } from "@mantine/core";
import { BellIcon, ReaderIcon } from "@radix-ui/react-icons";

import { getCartStatus, getCategories, getMenuItems, getOrderHistory, requestAssistance } from "@/services";
import { cartView, category, groupedOrders, menuItems } from "@/models";
import { ThemeToggle, ViewMenuItemModal, ViewCartOrderModal, CustomerSidebar, CustomerMain } from "@/components";
import { mapToGroupedOrderItems } from "@/helpers";

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
  const [isMenuItemListLoading, menuItemListHandler] = useDisclosure(true);
  const [isCategoryListLoading, categoryListHandler] = useDisclosure(true);
  const [cartItems, setCartItems] = useState([] as cartView[]);
  const [isCartLoading, cartHandler] = useDisclosure(false);
  const [orderHistory, setOrders] = useState([] as groupedOrders[]);
  const [isOrderLoading, ordersHandler] = useDisclosure(true);

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
        toast("Requested for assistance!");
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

  useEffect(() => {
    const fetchData = async () => {
      const cart = await getCartStatus(tableNo);
      setCartItems(cart);
      cartHandler.close();
    };

    if (isCartLoading) {
      fetchData().catch(() => console.error("there was an error loading cart"));
    }
  }, [cartHandler, cartItems, isCartLoading, tableNo]);

  useEffect(() => {
    const fetchData = async () => {
      const orderHistory = await getOrderHistory(tableNo);
      const groupedOrders = mapToGroupedOrderItems(orderHistory);
      setOrders(groupedOrders);
      ordersHandler.close();
    };

    if (isOrderLoading) {
      fetchData().catch(() => console.error("error loading order history"));
    }
  }, [isOrderLoading, ordersHandler, tableNo]);

  useEffect(() => {
    const fetchData = async () => {
      const menuItems: menuItems[] = await getMenuItems();
      const orderedItems = menuItems.sort((a) => a.position);
      setMenuItemList(orderedItems);

      const categories = await getCategories();
      let categoriesSet = new Set();
      menuItems.forEach((item) => item.category.forEach((cat) => categoriesSet.add(cat)));
      const filteredSortedCategories = categories
        .filter((c) => categoriesSet.has(c.url))
        .sort((c) => c.position);

      setCategoryList(filteredSortedCategories);

      menuItemListHandler.close();
      categoryListHandler.close();
    };

    if (isMenuItemListLoading || isCategoryListLoading) {
      fetchData().catch(() => console.error("error refreshing menu"));
    }
  }, [categoryListHandler, isCategoryListLoading, isMenuItemListLoading, menuItemListHandler]);

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
      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
      <AppShell.Header>
        <div className="navbar">
          <Flex align="center" gap="sm" flex={1}>
            <Image
              className="logo"
              src="/logo.svg"
              h={isMobile ? 25 : 45}
              alt="CtrlAltDelEat Logo"
            />
            <Text className="table-number" fw={700} size={isMobile ? "sm" : "md"}>
              Table #{tableNo}
            </Text>
          </Flex>
          <Flex justify="flex-end" gap="sm">
            <ActionIcon size="lg" onClick={() => {
              cartHandler.open();
              openCartModal();
            }}>
              <ReaderIcon/>
            </ActionIcon>
            <ActionIcon size="lg" onClick={handleRequestForAssistance}>
              <BellIcon/>
            </ActionIcon>
            <ThemeToggle/>
          </Flex>
        </div>
        <Paper pb="xs" shadow="sm" radius={0} hiddenFrom="sm">
          <Flex justify="center">
            <Select
              hiddenFrom="sm"
              checkIconPosition="left"
              allowDeselect={false}
              size="md"
              className="w-100"
              value={category.category_name}
              data={categoryList.map((c) => c.category_name)}
              onChange={(e) => handleSelectCategory(categoryList.find((c) => c.category_name == e))}
              mx="md"
            />
          </Flex>
        </Paper>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <CustomerSidebar
          category={category}
          categoryList={categoryList}
          isLoading={isCategoryListLoading}
          onCategorySelect={handleSelectCategory}
          onRefresh={categoryListHandler.open}
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
        onSubmit={menuItemListHandler.open}
      />

      <ViewCartOrderModal
        tableNo={tableNo}
        isOpen={addMenuItemModalOpened}
        onClose={closeCartModal}
        cartItems={cartItems}
        updateCart={cartHandler.open}
        orderHistoryList={orderHistory}
        updateOrderItems={ordersHandler.open}
        menuItemList={menuItemList}
      />
    </AppShell>
  );
}
