import { Card, Collapse, Flex, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { HistoryProps, itemView } from "@/models";
import { OrderItem } from "@/components";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

export function OrderHistoryItem ({ groupedOrders, index }: HistoryProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <UnstyledButton onClick={toggle} key={index}>
      <Card className={`order-list-toggle ${opened ? "selected" : ""}`} padding="lg" radius="md" shadow="sm" withBorder>
        <Flex direction="row" align="center" justify="space-between">
          <Flex gap="md" align="center">
            {opened ? <ChevronUpIcon width={20} height={20}/> : <ChevronDownIcon width={20} height={20}/>}
            <Text size="md">Order number: {index + 1}</Text>
          </Flex>
          <Text size="md">${groupedOrders.totalCost}</Text>
        </Flex>
      </Card>
      <Collapse in={opened}>
        <Card p="xs" withBorder>
          <Stack gap="xs">
            {groupedOrders.items.map((item: itemView, k: number) => <OrderItem item={item} key={k}/>)}
          </Stack>
        </Card>
      </Collapse>
    </UnstyledButton>
  );
};
