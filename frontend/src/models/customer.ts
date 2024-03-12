import { category, menuItems } from "@/models";

export interface CustomerSidebarProps {
    onCategorySelect: (_category: category) => void
    categoryList: category[]
    isLoading: boolean
    onRefresh: () => void
}

export interface CustomerMainProps {
    items: menuItems[]
    tableNo: number
}
