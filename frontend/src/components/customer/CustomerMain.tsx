import { Card, Flex, Stack, UnstyledButton, Image, Text, Title } from "@mantine/core";

import { menuItems, CustomerMainProps } from "@/models";
import { imagePlaceholder } from "@/constants";
import { useMediaQuery } from "@mantine/hooks";

export function CustomerMain({ category, items, onMenuItemSelect, onViewMenuItem }: CustomerMainProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const generateMenuItem = (item: menuItems, k: number) => {
    return (
      <UnstyledButton key={k} onClick={() => {
        onMenuItemSelect(item);
        onViewMenuItem();
      }}>
        <Card className="menu-item" shadow="sm" padding="lg" radius="md" withBorder={true}>
          <Flex gap="md">
            <Image
              src={item.image}
              alt={`A picture of ${item.menuitem_name}`}
              fallbackSrc={imagePlaceholder}
              pos="relative"
              mah={100}
              miw={100}
            />
            <Stack justify="space-between" gap={0}>
              <Stack className="w-100" gap={5}>
                <Text size="lg" c="blue" fw={700} lineClamp={1}>{item.menuitem_name}</Text>
                <Text size="sm" c="dimmed" lineClamp={2} h={45}>{item.description}</Text>
              </Stack>
              <Text size="md">${item.cost}</Text>
            </Stack>
          </Flex>
        </Card>
      </UnstyledButton>
    );
  };

  return (
    <div>
      <Stack gap="xs" mt={isMobile ? 50 : 0}>
        <Title order={2} visibleFrom="sm">{category.category_name}</Title>
        {items.map((item, k) => generateMenuItem(item, k))}
        {!category.url && <Text c="dimmed">No category selected.</Text>}
      </Stack>
    </div>
  );
}
