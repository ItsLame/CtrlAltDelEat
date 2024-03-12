import { category } from "@/models/categories";
import { menuItems } from "@/models/menuitems";

export interface CustomerSidebarProps {
    onCategorySelect: (_category: category) => void
    categoryList: category[]
    isLoading: boolean
    onRefresh: () => void
}

export interface CustomerMainProps {
    items: menuItems[]
}
