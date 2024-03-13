import { Button, LoadingOverlay, Stack } from "@mantine/core";

import { CustomerSidebarProps } from "@/models";

// eslint-disable-next-line no-unused-vars
export function CustomerSidebar({ category, categoryList, isLoading, onCategorySelect, onRefresh }: CustomerSidebarProps) {

  return (
    <div className="customer sidebar">
      <LoadingOverlay visible={isLoading} />
      <Stack gap={10}>
        {categoryList.map((c, k) => (
          <Button
            key={k}
            variant={c.url == category.url ? "filled" : "outline"}
            onClick={() => {
              onCategorySelect(c);
            }}
          >
            {c.category_name}
          </Button>
        )
        )}
      </Stack>
    </div>
  );
}
