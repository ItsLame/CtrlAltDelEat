"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Image from "next/image";

import { AddMenuItemModal, DeleteCategoryModal, DeleteMenuItemModal, EditMenuItemModal, ManagerMain, ManagerSidebar } from "@/components";
import { getCategories, getMenuItems } from "@/services";
import { category, menuItems } from "@/models";

export default function Manager() {
  const [sidebarOpened, { toggle }] = useDisclosure();
  const [addMenuItemModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [editMenuItemModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteMenuItemModalOpened, { open: openDeleteMenuItemModal, close: closeDeleteMenuItemModal }] = useDisclosure(false);
  const [deleteCategoryModalOpened, { open: openDeleteCategoryModal, close: closeDeleteCategoryModal }] = useDisclosure(false);

  const [category, setCategory] = useState({} as category);
  const [menuItem, setMenuItem] = useState({} as menuItems);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);

  const [targetCategory, setTargetCategory] = useState({} as category);

  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);

  const handleSelectCategory = (category: category) => {
    setCategory(category);
  };

  const handleSelectItem = async (item: menuItems) => {
    setMenuItem(item);
    openEditModal();
  };

  const handleEditCategory = (updatedCategory: category) => {
    setCategory(updatedCategory);
    refreshCategoryList(false);
  };

  const handleDeleteCategory = (category: category) => {
    setTargetCategory(category);
    openDeleteCategoryModal();
  };

  const handleDeleteCategoryAfter = (loadingAnimation=true) => {
    if (category.category_name === targetCategory.category_name) setCategory({} as category);
    refreshCategoryList(loadingAnimation);
  };

  const handleMenuItemAfter = (loadingAnimation=true) => {
    closeEditModal();
    closeDeleteMenuItemModal();
    refreshMenuList(loadingAnimation);
  };

  const refreshMenuList = (loadingAnimation=true) => {
    setMenuItemListLoading(loadingAnimation);
    getMenuItems().then((res) => {
      setMenuItemList(res);
      setMenuItemListLoading(false);
    });
  };

  const refreshCategoryList = (loadingAnimation=true) => {
    setCategoryListLoading(loadingAnimation);
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
          onCategoryDelete={handleDeleteCategory}
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
          onEditCategory={handleEditCategory}
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
        onDeleteMenuItem={openDeleteMenuItemModal}
        onClose={closeEditModal}
        onSubmit={refreshMenuList}
      />

      <DeleteCategoryModal
        category={targetCategory}
        isOpened={deleteCategoryModalOpened}
        onDelete={handleDeleteCategoryAfter}
        onClose={closeDeleteCategoryModal}
      />

      <DeleteMenuItemModal
        menuItem={menuItem}
        isOpened={deleteMenuItemModalOpened}
        onDelete={handleMenuItemAfter}
        onClose={closeDeleteMenuItemModal}
      />
      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
    </AppShell>
  );
}
