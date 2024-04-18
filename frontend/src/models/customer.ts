import { category, menuItems } from "@/models";

export interface CustomerSidebarProps {
    category: category
    categoryList: category[]
    isLoading: boolean
    onCategorySelect: (_category: category) => void
}

export interface CustomerMainProps {
    category: category
    items: menuItems[]
    onMenuItemSelect: (_menuItem: menuItems) => void
    onViewMenuItem: () => void
}

export interface ViewMenuItemModalProps {
    tableNo: number
    menuItem: menuItems
    isOpened: boolean
    isLoading: boolean
    onClose: () => void
}

export interface CustomerQRProps {
    isOpened: boolean
    onClose: () => void
}
