import { category, menuItems } from "@/models";

// Function props
export interface ManagerSidebarProps {
  category: category
  categoryList: category[]
  isLoading: boolean
  onCategorySelect: (_category: category) => void
  onRefresh: (_loadingAnimation?: boolean) => void
}

export interface ManagerMainProps {
  category: category
  menuItemList: menuItems[]
  isLoading: boolean
  onRefresh: (_loadingAnimation?: boolean) => void
  onAddMenuItem: () => void
  onEditMenuItem: (_menuItems : menuItems) => void
  onEditCategory: (_category: category) => void
}

export interface ManagerMainHeaderProps {
  category: category
  onRefresh: () => void
  onAddMenuItem: () => void
  onEditCategory: (_category: category) => void
}

export interface AddMenuItemModalProps {
  category: category
  categoryList: category[]
  isOpened: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: (_loadingAnimation?: boolean) => void
}

export interface EditMenuItemModalProps {
  menuItem: menuItems
  categoryList: category[]
  isOpened: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: (_loadingAnimation?: boolean) => void
}
