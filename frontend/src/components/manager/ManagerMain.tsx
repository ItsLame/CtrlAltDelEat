import { useEffect, useState } from "react";
import { Box, Card, Flex, LoadingOverlay, ScrollArea, Stack, Text, UnstyledButton, Image } from "@mantine/core";

import { ManagerMainProps, menuItems } from "@/models";
import { imagePlaceholder } from "@/constants";
import { ManagerMainHeader } from "@/components";

export function ManagerMain({ category, menuItemList, isLoading, onRefresh, onAddMenuItem, onEditMenuItem, onEditCategory }: ManagerMainProps) {
  const [menuItemListFiltered, setMenuItemListFiltered] = useState([] as menuItems[]);

  useEffect(() => {
    const filtered = menuItemList.filter(item => item.category.includes(category.url));
    setMenuItemListFiltered(filtered);
  }, [menuItemList, category]);

  return (
    <Box className="h-100" pos="relative">
      <ManagerMainHeader
        category={category}
        onRefresh={onRefresh}
        onAddMenuItem={onAddMenuItem}
        onEditCategory={onEditCategory}
      />
      <ScrollArea className="menu-item-list appshell-h-100">
        <LoadingOverlay zIndex={1000} visible={isLoading}/>
        <Stack>
          {menuItemListFiltered.length >= 1 ? menuItemListFiltered.map((item, k) => (
            <UnstyledButton key={k} onClick={() => {onEditMenuItem(item);}}>
              <Card className="menu-item" shadow="sm" padding="lg" radius="md" withBorder>
                <Flex gap="md">
                  <Flex w={80}>
                    <Image
                      src={item.image}
                      alt={`A picture of ${item.menuitem_name}`}
                      fallbackSrc={imagePlaceholder}
                    />
                  </Flex>
                  <Stack gap={0}>
                    <Text size="lg" c="blue" fw={700}>{item.menuitem_name}</Text>
                    <Text size="sm" c="dimmed">{item.description}</Text>
                    <Text size="md">${item.cost}</Text>
                  </Stack>
                </Flex>
              </Card>
            </UnstyledButton>
          )) : category.url && (
            <Text c="dimmed">
              Category is empty.
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
