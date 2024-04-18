import { Box, Card, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";

import { CustomerSidebarProps } from "@/models";

export function CustomerSidebar({ category, categoryList, isLoading, onCategorySelect }: CustomerSidebarProps) {

  return (
    <div className="customer sidebar">
      <LoadingOverlay visible={isLoading} />
      <Stack gap={10}>
        {categoryList.map((c, k) => {
          const isSelected = c.url === category.url;

          return (
            <Box
              key={k}
              tabIndex={0}
              onClick={() => onCategorySelect(c)}
              onKeyDown={(e) => e.key === "Enter" && onCategorySelect(c)}
              aria-label={`${c.category_name} category`}
            >
              <Card
                className={`category-item ${isSelected ? "selected" : ""}`}
                shadow="sm"
                radius="md"
                px="sm"
                py="md"
                color="blue"
                withBorder
              >
                <Flex align="center">
                  <Text fw={500}>{c.category_name}</Text>
                </Flex>
              </Card>
            </Box>
          );
        })}
      </Stack>
    </div>
  );
}
