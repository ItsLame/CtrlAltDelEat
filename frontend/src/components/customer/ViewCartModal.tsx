"use client";

import { cartView, ViewCartModalProps } from "@/models";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { imagePlaceholder } from "@/constants";
import { TrashIcon } from "@radix-ui/react-icons";
import { orderCart, removeFromCart } from "@/services";
import toast from "react-hot-toast";

const handleRemoveItem = (itemNo: number, action: () => void) => {
  removeFromCart(itemNo).then((res) => {
    switch (res) {
    case 204:
      toast.success("Item removed from cart.");
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
      <Flex direction={"column"}>
        <Flex direction={"row"} justify="space-between">
          <Text size="lg" c="blue" fw={700}>
            {item.itemName}
          </Text>
          <ActionIcon color={"grey"} variant="outline" size={"lg"}>
            <TrashIcon color={"red"} scale={2} onClick={() => handleRemoveItem(item.id, action)}/>
          </ActionIcon>
        </Flex>

        <Text size="sm" c="dimmed">
          {item.alterations}
        </Text>
        <Text size="md">quantity: {item.quantity}</Text>
        <Text size="md">
                    item cost: ${item.cost} total: $
          {(item.cost * item.quantity).toFixed(2)}
        </Text>
      </Flex>
    </Flex>
  </Card>
);

export function ViewCartModal(viewCartProps: ViewCartModalProps) {
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
  };

  const generateTotalCost = () => {
    let totalCost = 0;
    for (let i = 0; i < viewCartProps.cartItems.length; i += 1) {
      totalCost +=
                viewCartProps.cartItems[i].cost * viewCartProps.cartItems[i].quantity;
    }
    return <Text inline={true}>Subtotal: ${totalCost.toFixed(2)}</Text>;
  };

  return (
    <Modal
      opened={viewCartProps.isOpen}
      onClose={viewCartProps.onClose}
      title="Cart"
    >
      <Flex direction={"column"} gap={"sm"}>
        <ScrollArea.Autosize scrollbars={"y"} mah={550}>
          <Stack>
            {viewCartProps.cartItems
              ?.filter((item) => item.status == "in-cart")
              .map((i, k) => generateMenuItem(i, k, viewCartProps.updateCart))}
          </Stack>
        </ScrollArea.Autosize>
        <Flex align={"center"} direction={"row"} justify={"space-between"}>
          <Button onClick={handleSubmit}>Submit Order!</Button>
          {generateTotalCost()}
        </Flex>
      </Flex>
    </Modal>
  );
}
