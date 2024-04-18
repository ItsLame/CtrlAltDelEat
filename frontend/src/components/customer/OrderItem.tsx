import { OrderItemProps, statusType } from "@/models";
import { Badge, Card, Flex, Text } from "@mantine/core";

export function OrderItem ({ item }: OrderItemProps) {
  const statusBadgeColor = (itemStatus: statusType) => {
    switch (itemStatus) {
    case statusType.received: return "gray";
    case statusType.prepared: return "yellow";
    case statusType.serving: return "blue";
    case statusType.served: return "green";
    default: return "gray";
    }
  };

  return (
    <Card padding="sm" radius="md" withBorder>
      <Flex className="w-100" direction="row" justify="space-between" style={{ width: "100%" }} gap={15}>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" fw="bold">{item.itemName}</Text>
          <Text size="sm" c="dimmed" fs="italic" fz="sm">{item.alterations}</Text>
        </Flex>
        <Flex direction="column" align="flex-end" style={{ flex: 1 }}>
          <Badge mb={5} color={statusBadgeColor(item.status)}>{item.status}</Badge>
          <Text size="sm">Quantity: {item.quantity}</Text>
          <Text size="sm" c="dimmed">(${item.cost} x {item.quantity})</Text>
          <Text size="sm">${(item.quantity * item.cost).toFixed(2)} </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
