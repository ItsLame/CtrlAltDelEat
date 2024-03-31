"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Image from "next/image";

import { AddMenuItemModal, EditMenuItemModal, ManagerMain, ManagerSidebar } from "@/components";
import { getCategories, getMenuItems } from "@/services";
import { category, menuItems } from "@/models";

export default function Manager() {
  const [sidebarOpened, { toggle }] = useDisclosure();
  const [addMenuItemModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [editMenuItemModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const [category, setCategory] = useState({} as category);
  const [menuItem, setMenuItem] = useState({} as menuItems);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);

  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);

  const handleSelectCategory = (category: category) => {
    setCategory(category);
  };

  const handleSelectItem = async (item: menuItems) => {
    setMenuItem(item);
    openEditModal();
  };

  const refreshMenuList = (refresh=true) => {
    setMenuItemListLoading(refresh);
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
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ManagerSidebar
          category={category}
          categoryList={categoryList}
          isLoading={isCategoryListLoading}
          onCategorySelect={handleSelectCategory}
          onRefresh={refreshCategoryList}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <ManagerMain
          category={category}
          menuItemList={menuItemList}
          isLoading={isMenuItemListLoading}
          onRefresh={refreshMenuList}
          onAddMenuItem={openAddModal}
          onEditMenuItem={handleSelectItem}
        />
      </AppShell.Main>

      <AddMenuItemModal
        category={category}
        categoryList={categoryList}
        isOpened={addMenuItemModalOpened}
        isLoading={isMenuItemListLoading}
        onClose={closeAddModal}
        onSubmit={refreshMenuList}
      />

      <EditMenuItemModal
        menuItem={menuItem}
        categoryList={categoryList}
        isOpened={editMenuItemModalOpened}
        isLoading={isMenuItemListLoading}
        onClose={closeEditModal}
        onSubmit={refreshMenuList}
      />
      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
    </AppShell>
  );
}
