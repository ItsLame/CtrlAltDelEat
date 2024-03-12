import { category, menuItems } from "@/models";

// Function props
export interface ManagerSidebarProps {
  onCategorySelect: (_category: category) => void
  categoryList: category[]
  isLoading: boolean
  onRefresh: () => void
}

export interface ManagerMainProps {
  category: category
  menuItemList: menuItems[]
  isLoading: boolean
  onRefresh: () => void
  onAddMenuItem: () => void
}

export interface AddMenuItemModalProps {
  category: category
  categoryList: category[]
  isOpened: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}
