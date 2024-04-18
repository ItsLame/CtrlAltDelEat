import { category, menuItems } from "@/models";

// Function props
export interface ManagerSidebarProps {
  category: category;
  categoryList: category[];
  isLoading: boolean;
  onCategorySelect: (_category: category) => void;
  onCategoryDelete: (_category: category) => void;
  onRefresh: (_loadingAnimation?: boolean) => void;
}

export interface ManagerMainProps {
  category: category;
  menuItem: menuItems;
  menuItemList: menuItems[];
  isLoading: boolean;
  onRefresh: (_loadingAnimation?: boolean) => void;
  onAddMenuItem: () => void;
  onEditMenuItem: (_menuItem: menuItems) => void;
  onDeleteMenuItem: (_menuItem: menuItems) => void;
  onEditCategory: (_category: category) => void;
}

export interface ManagerMainHeaderProps {
  category: category;
  onRefresh: () => void;
  onAddMenuItem: () => void;
  onEditCategory: (_category: category) => void;
}

export interface AddMenuItemModalProps {
  category: category;
  categoryList: category[];
  menuItemList: menuItems[];
  isOpened: boolean;
  isLoading: boolean;
  isMobile?: boolean;
  onClose: () => void;
  onSubmit: (_loadingAnimation?: boolean) => void;
}

export interface EditMenuItemModalProps {
  menuItem: menuItems;
  categoryList: category[];
  isOpened: boolean;
  isLoading: boolean;
  isMobile?: boolean;
  onDeleteMenuItem: (_menuItem: menuItems) => void;
  onClose: () => void;
  onSubmit: (_loadingAnimation?: boolean) => void;
}

export interface DeleteMenuItemModalProps {
  menuItem: menuItems;
  isOpened: boolean;
  onDelete: (_loadingAnimation?: boolean) => void;
  onClose: () => void;
}

export interface DeleteCategoryModalProps {
  category: category;
  isOpened: boolean;
  onDelete: (_loadingAnimation?: boolean) => void;
  onClose: () => void;
}
