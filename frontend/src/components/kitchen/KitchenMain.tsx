// Note: Does not support functionality to remove an order from list

import { useEffect, useState } from "react";
import { Box, Card, Flex, Text, Title } from "@mantine/core";
import { UndoDeleteOrder } from "@/components";
import { KitchenMainProps, orderItems, Items } from "@/models";
import { updateItemStatus } from "@/services";
import toast from "react-hot-toast";

export function KitchenMain({ orderItemList, onRefresh }: KitchenMainProps) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [preparedCards, setCardsPrepared] = useState([] as Number[]);

  let timeOut: string | number | NodeJS.Timeout | undefined;

  const [orderList, setOrderList] = useState([] as orderItems[]);

  useEffect(() => {
    let countOrders = 0;
    const newOrders = orderItemList.map((order) => {
      const id = order.id;
      const items = order.items.filter(
        (one_item) => one_item.status === "received"
      );
      return { id, items };
    });

    const prgressOrders = newOrders.filter((order) => order.items.length !== 0);
    prgressOrders.forEach((order) => {
      countOrders += order.items.length;
    });
    setOrderList(prgressOrders);
    setTotalOrders(countOrders);
  }, [orderItemList]);

  const handleUndoClick = (tID: string, item: Items) => {
    toast.dismiss(tID);
    clearTimeout(timeOut);
    setCardsPrepared((prevCards) =>
      prevCards.filter((itemnum) => itemnum !== item.id)
    );
  };

  const handleDelete = (tID: string, item: Items) => {
    toast.dismiss(tID);

    const itemID = item.id;
    const updateItem = {
      tableNumber: item.tableNumber,
      itemName: item.itemName,
      cost: item.cost,
      status: "prepared",
    };

    updateItemStatus(itemID, updateItem).then(onRefresh);
  };

  const handleClick = (item: Items) => {
    if (!preparedCards.includes(item.id)) {
      let x = "";
      setCardsPrepared((prevCards) => [...prevCards, item.id]);
      toast((t) => {
        x = t.id;
        return (
          <UndoDeleteOrder
            item={item}
            handleUndoClick={() => {
              handleUndoClick(t.id, item);
            }}
          />
        );
      });
      timeOut = setTimeout(() => {
        handleDelete(x, item);
      }, 6000);
    }
  };

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
        {orderList.map((order) =>
          order.items.map((single_item) => (
            <Card
              key={single_item.id}
              className={
                "kitchen-flex-items " +
                (preparedCards.includes(single_item.id)
                  ? "prepped-col"
                  : "unprepped-col")
              }
              shadow="md"
              radius="md"
              padding="sm"
              withBorder
              onClick={() => handleClick(single_item)}
            >
              <Flex
                gap="xs"
                justify="space-between"
                className="order-first-line"
              >
                <Text size="md">Table No: {single_item.tableNumber} </Text>
                <Text size="md" className="order-time">
                  Created on:
                  {single_item.timestamp.slice(
                    0,
                    single_item.timestamp.indexOf(".")
                  )}
                </Text>
              </Flex>
              <Text size="md">Order no. {order.id}</Text>
              <Text size="md" mb="0.5rem">
                Item no. {single_item.id}
              </Text>

              <Box>
                <Text size="md">
                  {single_item.quantity} x {single_item.itemName}
                </Text>
                {single_item.alterations && (
                  <Text size="md">Alterations: {single_item.alterations}</Text>
                )}
              </Box>
            </Card>
          ))
        )}
      </Flex>
    </Box>
  );
}
