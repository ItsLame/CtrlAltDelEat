import { Card, Flex, Stack, UnstyledButton, Image, Text, Title } from "@mantine/core";

import { menuItems, CustomerMainProps } from "@/models";
import { imagePlaceholder } from "@/constants";

export function CustomerMain({ category, items, onMenuItemSelect, onViewMenuItem }: CustomerMainProps) {
  const generateMenuItem = (item: menuItems, k: number) => (
    <UnstyledButton key={k} onClick={() => {
      onMenuItemSelect(item);
      onViewMenuItem();
    }}>
      <Card className="menu-item" shadow="sm" padding="lg" radius="md" withBorder={true}>
        <Flex gap={15}>
          <Flex w={80}>
            <Image
              src={item.image}
              alt={`A picture of ${item.menuitem_name}`}
              fallbackSrc={imagePlaceholder}
            />
          </Flex>
          <Flex direction={"column"}>
            <Text size="lg" c="blue" fw={700}>{item.menuitem_name}</Text>
            <Text size="sm" c="dimmed">{item.description}</Text>
            <Text size="md">${item.cost}</Text>
          </Flex>
        </Flex>
      </Card>
    </UnstyledButton>
  );

  return (
    <div>
      <Stack>
        <Title order={2} visibleFrom="sm">{category.category_name}</Title>
        {items.map((item, k) => generateMenuItem(item, k))}
      </Stack>
    </div>
  );
}
