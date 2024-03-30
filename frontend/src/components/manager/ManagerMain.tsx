import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ActionIcon, Box, Button, Card, Flex, LoadingOverlay, ScrollArea, Stack, Title, Text, UnstyledButton, Image } from "@mantine/core";

import { ManagerMainProps, menuItems } from "@/models";
import { imagePlaceholder } from "@/constants";

export function ManagerMain({ category, menuItemList, isLoading, onRefresh, onAddMenuItem }: ManagerMainProps) {
  const [menuItemListFiltered, setMenuItemListFiltered] = useState([] as menuItems[]);

  useEffect(() => {
    const filtered = menuItemList.filter(item => item.category.includes(category.url));
    setMenuItemListFiltered(filtered);
  }, [menuItemList, category]);

  return (
    <Box className="h-100" pos="relative">
      {category.url ? (
        <Flex justify="space-between" pos="sticky">
          <Title order={2}>{category.category_name}</Title>
          <Flex gap={15} align="center">
            <ActionIcon variant="subtle" onClick={onRefresh}><ReloadIcon /></ActionIcon>
            <Button onClick={onAddMenuItem}>Add Item</Button>
          </Flex>
        </Flex>
      ): (
        <Text c="dimmed">
          No category selected.
        </Text>
      )}

      <ScrollArea className="menu-item-list appshell-h-100">
        <LoadingOverlay zIndex={1000} visible={isLoading}/>
        <Stack>
          {menuItemListFiltered.length >= 1 ? menuItemListFiltered.map((item, k) => (
            <UnstyledButton key={k}>
              <Card className="menu-item" shadow="sm" padding="lg" radius="md" withBorder>
                <Flex gap={15}>
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
