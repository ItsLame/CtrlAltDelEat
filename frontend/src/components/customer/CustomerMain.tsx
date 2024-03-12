import { Card, Flex, Stack, UnstyledButton, Image, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

import { menuItems, CustomerMainProps } from "@/models";

export function CustomerMain({ items, tableNo }: CustomerMainProps) {
  const router = useRouter();

  const generateMenuItem = (item: menuItems, k: number) => (
    <UnstyledButton onClick={() => {
      console.log("going to: " + item.menuitem_name + " page");
      router.push(`${tableNo}/item`);
    }}>
      <Card className="menu-item" key={k} shadow="sm" padding="lg" radius="md" withBorder={true}>
        <Flex gap={15}>
          <Flex w={80}>
            <Image
              src={null}
              alt={`A picture of ${item.menuitem_name}`}
              fallbackSrc="https://placehold.co/600x400?text=Image%20Preview"
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
        {items.map((item, k) => generateMenuItem(item, k))}
      </Stack>
    </div>
  );
}
