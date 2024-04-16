"use client";

import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AddMenuItemModal, DeleteCategoryModal, DeleteMenuItemModal, EditMenuItemModal, LogoWithLink, LogoutButton, ManagerMain, ManagerSidebar, ThemeToggle } from "@/components";
import { getCategories, getMenuItems, getUserCookies } from "@/services";
import { category, menuItems, userType } from "@/models";
import { siteRoute } from "@/constants";
import { noPermissionToast } from "@/helpers";

export default function Manager() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 495px)");

  const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure();
  const [addMenuItemModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [editMenuItemModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteMenuItemModalOpened, { open: openDeleteMenuItemModal, close: closeDeleteMenuItemModal }] = useDisclosure(false);
  const [deleteCategoryModalOpened, { open: openDeleteCategoryModal, close: closeDeleteCategoryModal }] = useDisclosure(false);

  const [category, setCategory] = useState({} as category);
  const [menuItem, setMenuItem] = useState({} as menuItems);
  const [menuItemList, setMenuItemList] = useState([] as menuItems[]);
  const [categoryList, setCategoryList] = useState([] as category[]);

  const [targetCategory, setTargetCategory] = useState({} as category);
  const [targetMenuItem, setTargetMenuItem] = useState({} as menuItems);

  const [isMenuItemListLoading, setMenuItemListLoading] = useState(true);
  const [isCategoryListLoading, setCategoryListLoading] = useState(true);

  const handleSelectCategory = (category: category) => {
    setCategory(category);
    sidebarOpened && toggleSidebar();
  };

  const handleSelectItem = (item: menuItems) => {
    setMenuItem(item);
    openEditModal();
  };

  const handleUnselectItem = () => {
    setMenuItem({} as menuItems);
    closeEditModal();
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

  const handleDeleteMenuItem = (menuItem?: menuItems) => {
    menuItem && setTargetMenuItem(menuItem);
    openDeleteMenuItemModal();
  };

  const handleDeleteMenuItemAfter = (loadingAnimation=true) => {
    closeEditModal();
    closeDeleteMenuItemModal();
    refreshMenuList(loadingAnimation);
  };

  const handleDeleteMenuItemCancel = () => {
    closeDeleteMenuItemModal();
    setTargetMenuItem({} as menuItems);
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

  const refreshAllList = useCallback(() => {
    refreshCategoryList();
    refreshMenuList();
  }, []);

  useEffect(() => {
    getUserCookies().then((res) => {
      const permittedUsers = new RegExp(`${userType.manager}`);
      if (res && (res.isSuperUser === "true" || permittedUsers.test(res.groups || ""))) refreshAllList();
      else {
        router.push(siteRoute.auth);
        noPermissionToast();
      };
    });
  }, [refreshAllList, router]);

  return (
    <AppShell
      className="manager"
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
          <Flex className="w-100" align="center">
            <Burger
              className="burger"
              opened={sidebarOpened}
              onClick={toggleSidebar}
              hiddenFrom="sm"
              size="sm"
            />
            <LogoWithLink />
          </Flex>
          <Flex gap="sm">
            <ThemeToggle />
            <LogoutButton />
          </Flex>
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

      <AppShell.Main pb={0}>
        <ManagerMain
          category={category}
          menuItem={menuItem}
          menuItemList={menuItemList}
          isLoading={isMenuItemListLoading}
          onRefresh={refreshMenuList}
          onAddMenuItem={openAddModal}
          onEditMenuItem={handleSelectItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onEditCategory={handleEditCategory}
        />
      </AppShell.Main>

      <AddMenuItemModal
        category={category}
        categoryList={categoryList}
        menuItemList={menuItemList}
        isOpened={addMenuItemModalOpened}
        isLoading={isMenuItemListLoading}
        isMobile={isMobile}
        onClose={closeAddModal}
        onSubmit={refreshMenuList}
      />

      <EditMenuItemModal
        menuItem={menuItem}
        categoryList={categoryList}
        isOpened={editMenuItemModalOpened}
        isLoading={isMenuItemListLoading}
        isMobile={isMobile}
        onDeleteMenuItem={handleDeleteMenuItem}
        onClose={handleUnselectItem}
        onSubmit={refreshMenuList}
      />

      <DeleteCategoryModal
        category={targetCategory}
        isOpened={deleteCategoryModalOpened}
        onDelete={handleDeleteCategoryAfter}
        onClose={closeDeleteCategoryModal}
      />

      <DeleteMenuItemModal
        menuItem={targetMenuItem}
        isOpened={deleteMenuItemModalOpened}
        onDelete={handleDeleteMenuItemAfter}
        onClose={handleDeleteMenuItemCancel}
      />
      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
    </AppShell>
  );
}
