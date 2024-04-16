"use client";

import {
  ActionIcon,
  Button,
  Card, Collapse,
  Flex,
  Image,
  Modal,
  ScrollArea,
  Stack, Tabs,
  Text, UnstyledButton,
} from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";

import { imagePlaceholder } from "@/constants";
import { generateBill, orderCart, removeFromCart } from "@/services";
import { cartView, HistoryProps, itemView, OrderItemProps, ViewCartModalProps } from "@/models";

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

const generateMenuItem = (item: cartView, key: number, action: () => void) => (
  <Card padding="lg" radius="md" withBorder={true} key={key}>
    <Flex gap={15}>
      <Flex w={100}>
        <Image
          src={null}
          alt={`A picture of ${item.itemName}`}
          fallbackSrc={imagePlaceholder}
        />
      </Flex>
      <Flex className="w-100" direction={"column"}>
        <Flex direction={"row"} justify="space-between">
          <Text size="lg" c="blue" fw={700}>
            {item.itemName}
          </Text>
          <ActionIcon variant="light" size={"lg"} color="red">
            <TrashIcon scale={2} onClick={() => handleRemoveItem(item.id, action)}/>
          </ActionIcon>
        </Flex>

        <Text size="sm" c="dimmed">
          {item.alterations}
        </Text>
        <Text size="md">Quantity: {item.quantity}</Text>
        <Flex gap={5}>
          <Text size="md">${(item.cost * item.quantity).toFixed(2)}</Text>
          <Text c="dimmed">(${item.cost} x {item.quantity})</Text>
        </Flex>
      </Flex>
    </Flex>
  </Card>
);

const OrderItem = ({ item }: OrderItemProps) => (
  <Card padding="lg" radius="md" withBorder={true}>
    <Flex direction={"row"} justify="space-between" style={{ width: "100%" }} gap={15}>
      <Flex direction={"column"} style={{ flex: 1 }}>
        <Text size="sm" w="bold">{item.itemName}</Text>
        <Text size="sm" c="gray">{item.alterations}</Text>
      </Flex>
      <Flex direction={"column"} justify="start" style={{ flex: 1 }}>
        <Text size="sm">Item cost: ${item.cost}</Text>
        <Text size="sm">Amount: {item.quantity}</Text>
        <Text size="sm">Total: ${(item.quantity * item.cost).toFixed(2)}</Text>
      </Flex>
    </Flex>
  </Card>
);

const OrderHistoryItem = ({ groupedOrders, index }: HistoryProps) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <UnstyledButton onClick={toggle} key={index}>
      <Card padding="lg" radius="md" withBorder={true}>
        <Flex direction={"row"} align={"center"} gap="xl" justify={"space-between"}>
          <Text size="sm">Order number: {index + 1}</Text>
          <Text size="sm">${groupedOrders.totalCost}</Text>
        </Flex>
      </Card>
      <Collapse in={opened}>
        {groupedOrders.items.map((item: itemView, k: number) => <OrderItem item={item} key={k}/>)}
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
    viewCartProps.updateCart();
    viewCartProps.onClose();
    viewCartProps.updateOrderItems();
  };

  const generateTotalCartCost = () => {
    let totalCost = 0;
    for (let i = 0; i < viewCartProps.cartItems.length; i += 1) {
      totalCost +=
                viewCartProps.cartItems[i].cost * viewCartProps.cartItems[i].quantity;
    }
    return <Text inline={true}>Subtotal: ${totalCost.toFixed(2)}</Text>;
  };

  const generateTotalOrderCost = () => {
    const cost = viewCartProps.orderHistoryList.reduce((acc, item) => acc + item.totalCost, 0);
    return <Text inline={true}>Subtotal: ${cost.toFixed(2)}</Text>;
  };

  const handlePayBill = () => {
    generateBill(viewCartProps.tableNo).then((res) => {
      switch (res) {
      case 200:
        viewCartProps.updateOrderItems();
        viewCartProps.onClose();
        toast.success("Bill paid, have a good night!");
        break;
      default:
        toast.error("failed to pay bill");
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
          <Tabs.Tab value="orders">
            Orders
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="cart">
          <Flex direction={"column"} gap={"sm"}>
            <ScrollArea.Autosize scrollbars={"y"} mah={550}>
              {viewCartProps.cartItems.length >= 1 ? (
                <Stack>
                  {viewCartProps.cartItems
                    ?.filter((item) => item.status == "in-cart")
                    .map((i, k) => generateMenuItem(i, k, viewCartProps.updateCart))}
                </Stack>
              ): <Text c="dimmed">Cart is empty.</Text>
              }

            </ScrollArea.Autosize>
            <Flex align={"center"} direction={"row"} justify={"space-between"}>
              {generateTotalCartCost()}
              <Button onClick={handleSubmit} disabled={viewCartProps.cartItems.length <= 0}>Submit Order</Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="orders">
          <Flex direction={"column"} gap="sm">
            <ScrollArea.Autosize scrollbars={"y"} mah={550}>
              {viewCartProps.orderHistoryList.length >= 1 ? (
                <Stack>
                  {viewCartProps.orderHistoryList.map((order, index) => (
                    <OrderHistoryItem groupedOrders={order} index={index} key={index}/>
                  ))}
                </Stack>
              ): <Text c="dimmed">Order history is empty.</Text>
              }

            </ScrollArea.Autosize>
            <Flex align={"center"} direction={"row"} justify={"space-between"}>
              {generateTotalOrderCost()}
              <Button onClick={handlePayBill} px="xl" disabled={viewCartProps.orderHistoryList.length <= 0}>Pay Bill</Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

      </Tabs>
    </Modal>
  );
}
