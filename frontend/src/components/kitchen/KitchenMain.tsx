import { useEffect, useState } from "react";
import { Blockquote, Box, Card, Flex, Text, Title } from "@mantine/core";
import toast from "react-hot-toast";

import { UndoDeleteOrder } from "@/components";
import { KitchenMainProps, orderItems, Items, statusType } from "@/models";
import { updateItemStatus } from "@/services";

export function KitchenMain({ orderItemList, onRefresh }: KitchenMainProps) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [preparedCards, setCardsPrepared] = useState([] as Number[]);
  const [orderList, setOrderList] = useState([] as orderItems[]);

  let timeOut: string | number | NodeJS.Timeout | undefined;

  useEffect(() => {
    let countOrders = 0;
    const newOrders = orderItemList.map((order) => {
      const id = order.id;
      const items = order.items.filter((oneItem) => oneItem.status === statusType.received);
      return { id, items };
    });

    const prgressOrders = newOrders.filter((order) => order.items.length !== 0);
    prgressOrders.forEach((order) => countOrders += order.items.length);
    setOrderList(prgressOrders);
    setTotalOrders(countOrders);
  }, [orderItemList]);

  const handleUndoClick = (tID: string, item: Items) => {
    toast.dismiss(tID);
    clearTimeout(timeOut);
    setCardsPrepared((prevCards) => prevCards.filter((itemnum) => itemnum !== item.id));
  };

  const handleDelete = (tID: string, item: Items) => {
    toast.dismiss(tID);
    const itemID = item.id;
    updateItemStatus(itemID, statusType.prepared).then(onRefresh);
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
            handleUndoClick={() => handleUndoClick(t.id, item)}
          />
        );
      }, { duration: 5000 });

      timeOut = setTimeout(() => handleDelete(x, item), 5000);
    }
  };

  return (

    <Box className="appshell-h-100">
      <Title order={2}>Incoming Orders ({totalOrders})</Title>
      <Flex
        direction={{ base: "row", sm: "row", md: "column" }}
        gap={{ base: "xs", sm: "sm" }}
        justify={{ base: "flex-start" }}
        className="kitchen-container bordered br-10"
        wrap="wrap"
      >
        {orderList.length > 0 ? orderList.map((order) => order.items.map((singleItem) => (
          <Card
            key={singleItem.id}
            shadow="md"
            radius="md"
            padding="xs"
            withBorder
            className={`kitchen-items ${(preparedCards.includes(singleItem.id)? "prepped" : "")}`}
            onClick={() => handleClick(singleItem)}
            onKeyDown={(e) => {
              e.stopPropagation();
              e.key === "Enter" && handleClick(singleItem);
            }}
            tabIndex={0}
            aria-label={`Press enter to set ${singleItem.itemName} for table number ${singleItem.tableNumber} as ready to serve`}
          >
            <Flex
              gap="xs"
              justify="space-between"
              className="order-first-line"
            >
              <Text size="md">Table No: {singleItem.tableNumber}</Text>
              <Text className="order-time" size="md" c="red">
                Created on: {singleItem.timestamp.slice(0, singleItem.timestamp.indexOf("."))}
              </Text>
            </Flex>

            <Text size="md" mb="xs">Item No: {singleItem.id}</Text>

            <Box className="order-items" p="xs" >
              <Flex justify="space-between">
                <Title className="item-name" order={5} textWrap="balance">{singleItem.itemName}</Title>
                <Title order={4}>x {singleItem.quantity}</Title>
              </Flex>

              {singleItem.alterations != "" && <Blockquote p={0} pl="xs" c="dimmed" fs="italic">{singleItem.alterations}</Blockquote>}
            </Box>
          </Card>
        ))) : <Text p="md" c="dimmed">No items ordered yet.</Text>}
      </Flex>
    </Box>
  );
}
