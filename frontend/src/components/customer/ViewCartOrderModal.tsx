"use client";

import { useEffect } from "react";
import { ActionIcon, Blockquote, Button, Card, Flex, Image, Modal, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

import { imagePlaceholder } from "@/constants";
import { generateBill, orderCart, removeFromCart } from "@/services";
import { cartView, menuItems, statusType, ViewCartModalProps } from "@/models";
import { OrderHistoryItem } from "@/components";

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

        <Flex className="w-100" direction="column">
          <Flex>
            <Text className="w-100" size="lg" c="blue" fw={700}>{item.itemName}</Text>
            <ActionIcon
              variant="light" size="xl" color="red"
              onClick={() => handleRemoveItem(item.id, action)}
              aria-label={`Remove ${item.quantity} ${item.itemName} from cart`}
            >
              <TrashIcon />
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

export function ViewCartOrderModal({ cartItems, orderHistoryList, menuItemList, tableNo, isOpen, updateCart, updateOrderItems, onClose }: ViewCartModalProps) {
  const handleSubmit = () => {
    orderCart(tableNo).then((res) => {
      switch (res) {
      case 200:
        toast.success("Order sent to kitchen!");
        break;
      default:
        toast.error("failed to submit order");
        break;
      }
    });

    onClose();
    updateCart();
    updateOrderItems();
  };

  const generateTotalCartCost = () => {
    let totalCost = 0;
    for (let i = 0; i < cartItems.length; i += 1) {
      totalCost += cartItems[i].cost * cartItems[i].quantity;
    }
    return <Text tabIndex={0} inline>Subtotal: ${totalCost.toFixed(2)}</Text>;
  };

  const generateTotalOrderCost = () => {
    const cost = orderHistoryList.reduce((acc, item) => acc + item.totalCost, 0);
    return <Text tabIndex={0} inline>Subtotal: ${cost.toFixed(2)}</Text>;
  };

  const handlePayBill = () => {
    generateBill(tableNo).then((res) => {
      switch (res) {
      case 200:
        updateOrderItems();
        onClose();
        toast.success("Bill sent! Please approach the counter to finalize payment.", { duration: 5000 });
        break;
      default:
        toast.error("Failed to request for bill");
        break;
      }
    });
  };

  /* Fetches every 2 seconds. */
  useEffect(() => {
    const intervalId = setInterval(updateOrderItems, 2000);
    return () => clearInterval(intervalId);
  }, [updateOrderItems]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
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
          <Flex direction="column" gap="sm">
            <ScrollArea.Autosize scrollbars="y" mah={430}>
              {cartItems.length >= 1 ? (
                <Stack gap="xs">
                  {cartItems
                    ?.filter((item) => item.status === statusType.inCart)
                    .map((i, k) => generateMenuItem(i, k, menuItemList, updateCart))
                  }
                </Stack>
              ): <Text c="dimmed">Cart is empty.</Text>}

            </ScrollArea.Autosize>
            <Flex align="center" direction="row" justify="space-between">
              {generateTotalCartCost()}
              <Button onClick={handleSubmit} disabled={cartItems.length <= 0}>Submit Order</Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="orders">
          <Flex direction="column" gap="xs">
            <ScrollArea.Autosize scrollbars="y" mah={430}>
              {orderHistoryList.length >= 1 ? (
                <Stack pb="xs" gap="xs">
                  {orderHistoryList
                    .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
                    .map((order, index) => <OrderHistoryItem groupedOrders={order} index={index} key={index}/>)
                  }
                </Stack>
              ): <Text c="dimmed">Order history is empty.</Text>}
            </ScrollArea.Autosize>

            <Flex align="center" direction="row" justify="space-between">
              {generateTotalOrderCost()}
              <Button
                px="xl" color="green"
                disabled={orderHistoryList.length <= 0}
                onClick={handlePayBill}
              >
                Pay Bill
              </Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

      </Tabs>
    </Modal>
  );
}
