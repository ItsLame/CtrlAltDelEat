// Note: Does not support functionality to remove an order from list

import { useEffect, useState } from "react";
import { Box, Card, Flex, Title } from "@mantine/core";

import { KitchenMainProps, orderItems } from "@/models";

export function KitchenMain({ orderItemList }: KitchenMainProps) {
  const [orderItemListSorted, setOrderItemListSorted] = useState(
    [] as orderItems[]
  );

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const sorted = orderItemList.toSorted();
    setOrderItemListSorted(sorted);
    setTotalOrders(sorted.length);
  }, [orderItemList]);

  return (
    <Box className="appshell-h-100 kitchen-main">
      <Title order={2}>Incoming Orders ({totalOrders})</Title>
      <Flex
        direction={{ base: "row", sm: "row", md: "column" }}
        gap={{ base: "xs", sm: "sm" }}
        justify={{ base: "flex-start" }}
        className="kitchen-flex-style"
        wrap="wrap"
        bg="var(--mantine-color-blue-light)"
      >
        {orderItemListSorted.map((order) => (
          <Card
            key={order.tableNumber}
            className="kitchen-flex-items"
            shadow="md"
            radius="md"
            padding="sm"
            withBorder
          >
            <Flex gap="xs" justify="space-between" className="order-first-line">
              <span>Table No.: {order.tableNumber}</span>
              <span className="order-time">
                Created on:{" "}
                {order.timestamp.slice(0, order.timestamp.indexOf("."))}
              </span>
            </Flex>
            <span className="small-break">Order no: {order.orderno} </span>

            <span>
              {/* {order.quantity}  */}1 x {order.itemName}
            </span>
            {order.alterations && (
              <span>Alterations: {order.alterations} </span>
            )}
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
