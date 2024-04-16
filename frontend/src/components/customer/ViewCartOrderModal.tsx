"use client";

import {
  ActionIcon,
  Badge,
  Blockquote,
  Button,
  Card, Collapse,
  Flex,
  Image,
  Modal,
  ScrollArea,
  Stack, Tabs,
  Text, UnstyledButton,
} from "@mantine/core";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";

import { imagePlaceholder } from "@/constants";
import { generateBill, orderCart, removeFromCart } from "@/services";
import { cartView, HistoryProps, itemView, menuItems, OrderItemProps, statusType, ViewCartModalProps } from "@/models";

const handleRemoveItem = (itemNo: number, action: () => void) => {
  removeFromCart(itemNo).then((res) => {
    switch (res) {
    case 204:
      toast.success("Item removed from cart");
      action();
      break;
    default:
      toast.error("Error, failed to remove item");
      break;
    }
  });
};

const generateMenuItem = (item: cartView, key: number, itemList: menuItems[], action: () => void) => {
  const itemImage = itemList.find((mi) => mi.menuitem_name === item.itemName)?.image;

  return (
    <Card key={key} padding="md" radius="md" withBorder>
      <Flex gap="sm">
        <Image
          src={itemImage}
          alt={`A picture of ${item.itemName}`}
          fallbackSrc={imagePlaceholder}
          mah={80}
          miw={80}
        />

        <Flex className="w-100" direction={"column"}>
          <Flex>
            <Text className="w-100" size="lg" c="blue" fw={700}>{item.itemName}</Text>
            <ActionIcon variant="light" size="xl" color="red">
              <TrashIcon onClick={() => handleRemoveItem(item.id, action)}/>
            </ActionIcon>
          </Flex>
          <Text size="md">Quantity: {item.quantity}</Text>
          <Flex gap={5}>
            <Text size="md">${(item.cost * item.quantity).toFixed(2)}</Text>
            <Text c="dimmed">(${item.cost} x {item.quantity})</Text>
          </Flex>
          <Blockquote p={0} pl="xs" c="dimmed" fs="italic">{item.alterations}</Blockquote>
        </Flex>
      </Flex>
    </Card>
  );
};

const OrderItem = ({ item }: OrderItemProps) => {
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
      <Flex direction={"row"} justify="space-between" style={{ width: "100%" }} gap={15}>
        <Flex direction={"column"} style={{ flex: 1 }}>
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

const OrderHistoryItem = ({ groupedOrders, index }: HistoryProps) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <UnstyledButton onClick={toggle} key={index}>
      <Card className={`order-list-toggle ${opened ? "selected" : ""}`} padding="lg" radius="md" shadow="sm" withBorder>
        <Flex direction={"row"} align={"center"} justify={"space-between"}>
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

export function ViewCartOrderModal(viewCartProps: ViewCartModalProps) {
  const handleSubmit = () => {
    orderCart(viewCartProps.tableNo).then((res) => {
      switch (res) {
      case 200:
        toast.success("Order sent to kitchen!");
        break;
      default:
        toast.error("failed to submit order");
        break;
      }
    });

    viewCartProps.onClose();
    viewCartProps.updateCart();
    viewCartProps.updateOrderItems();
  };

  const generateTotalCartCost = () => {
    let totalCost = 0;
    for (let i = 0; i < viewCartProps.cartItems.length; i += 1) {
      totalCost += viewCartProps.cartItems[i].cost * viewCartProps.cartItems[i].quantity;
    }
    return <Text inline>Subtotal: ${totalCost.toFixed(2)}</Text>;
  };

  const generateTotalOrderCost = () => {
    const cost = viewCartProps.orderHistoryList.reduce((acc, item) => acc + item.totalCost, 0);
    return <Text inline>Subtotal: ${cost.toFixed(2)}</Text>;
  };

  const handlePayBill = () => {
    generateBill(viewCartProps.tableNo).then((res) => {
      switch (res) {
      case 200:
        viewCartProps.updateOrderItems();
        viewCartProps.onClose();
        toast.success("Bill sent! Please approach the counter to finalize payment.", { duration: 5000 });
        break;
      default:
        toast.error("Failed to request for bill");
        break;
      }
    });
  };

  return (
    <Modal
      opened={viewCartProps.isOpen}
      onClose={viewCartProps.onClose}
      title="Order Information"
    >
      <Tabs variant="outline" defaultValue="cart">
        <Tabs.List mb="sm">
          <Tabs.Tab value="cart">
            Cart
          </Tabs.Tab>
          <Tabs.Tab value="orders" onClick={viewCartProps.updateOrderItems}>
            Orders
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="cart">
          <Flex direction={"column"} gap={"sm"}>
            <ScrollArea.Autosize scrollbars="y" mah={430}>
              {viewCartProps.cartItems.length >= 1 ? (
                <Stack gap="xs">
                  {viewCartProps.cartItems
                    ?.filter((item) => item.status === statusType.inCart)
                    .map((i, k) => generateMenuItem(i, k, viewCartProps.menuItemList, viewCartProps.updateCart))
                  }
                </Stack>
              ): <Text c="dimmed">Cart is empty.</Text>}

            </ScrollArea.Autosize>
            <Flex align={"center"} direction={"row"} justify={"space-between"}>
              {generateTotalCartCost()}
              <Button onClick={handleSubmit} disabled={viewCartProps.cartItems.length <= 0}>Submit Order</Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="orders">
          <Flex direction="column" gap="xs">
            <ScrollArea.Autosize scrollbars="y" mah={430}>
              {viewCartProps.orderHistoryList.length >= 1 ? (
                <Stack pb="xs" gap="xs">
                  {viewCartProps.orderHistoryList.map((order, index) => (
                    <OrderHistoryItem groupedOrders={order} index={index} key={index}/>
                  ))}
                </Stack>
              ): <Text c="dimmed">Order history is empty.</Text>}
            </ScrollArea.Autosize>

            <Flex align={"center"} direction={"row"} justify={"space-between"}>
              {generateTotalOrderCost()}
              <Button onClick={handlePayBill} px="xl" color="green" disabled={viewCartProps.orderHistoryList.length <= 0}>Pay Bill</Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

      </Tabs>
    </Modal>
  );
}
