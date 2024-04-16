import { Box, Card, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";

import { CustomerSidebarProps } from "@/models";

// eslint-disable-next-line no-unused-vars
export function CustomerSidebar({ category, categoryList, isLoading, onCategorySelect, onRefresh }: CustomerSidebarProps) {

  return (
    <div className="customer sidebar">
      <LoadingOverlay visible={isLoading} />
      <Stack gap={10}>
        {categoryList.map((c, k) => {
          const isSelected = c.url === category.url;

          return (
            <Box
              key={k}
              onClick={() => onCategorySelect(c)}
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
