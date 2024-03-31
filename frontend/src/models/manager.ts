import { category, menuItems } from "@/models";

// Function props
export interface ManagerSidebarProps {
  category: category
  categoryList: category[]
  isLoading: boolean
  onCategorySelect: (_category: category) => void
  onRefresh: () => void
}

export interface ManagerMainProps {
  category: category
  menuItemList: menuItems[]
  isLoading: boolean
  onRefresh: () => void
  onAddMenuItem: () => void
  onEditMenuItem: (_menuItems : menuItems) => void
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
