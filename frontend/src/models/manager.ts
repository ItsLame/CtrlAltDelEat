import { category, menuItems, ingredient, tag } from "@/models";

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
}

export interface AddMenuItemModalProps {
  category: category
  categoryList: category[]
  tagsList: tag[]
  ingredientsList: ingredient[]
  isOpened: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}