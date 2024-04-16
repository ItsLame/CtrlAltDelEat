import { serveProps } from "@/models";
import { Button, Card, Text, Flex, Title, Box, ActionIcon } from "@mantine/core";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function ReadyToServe({ allRequests, addToServeInProgress }: serveProps) {
  const [serveIndex, setServeIndex] = useState(0);

  const nextServeItem = () => serveIndex < allRequests.length - 1 && setServeIndex((prev) => prev + 1);
  const prevServeItem = () => serveIndex > 0 && setServeIndex((prev) => prev - 1);

  return (
    <Box className="h-50" m="md">
      <Title order={2} my="xs">
        Ready To Be Served
      </Title>

      <Box >
        {allRequests.length > 0 ? (
          <Flex direction="column" justify="space-between" className="">
            <Flex direction="column" justify="start" >
              <Card
                className="w-100"
                radius="md"
                p="sm"
                mb="sm"
                shadow="sm"
                withBorder
              >
                <Flex gap="xs" justify="space-between" className="order-first-line" >
                  <Text size="md">Table No: {allRequests[serveIndex].tableNumber}</Text>
                  <Text size="md" c="red">
                    Ready on: {allRequests[serveIndex].timestamp.slice(0, allRequests[serveIndex].timestamp.indexOf("."))}
                  </Text>
                </Flex>

                <Text size="md" mb="xs">Item No: {allRequests[serveIndex].id}</Text>

                <Box className="order-items" p="xs">
                  <Flex justify="space-between">
                    <Title className="item-name" order={5} textWrap="balance">{allRequests[serveIndex].itemName}</Title>
                    <Title order={4}>x {allRequests[serveIndex].quantity}</Title>
                  </Flex>

                  {allRequests[serveIndex].alterations !== "" && <Text size="md" c="dimmed" className="alterations">{allRequests[serveIndex].alterations}</Text>}
                </Box>
              </Card>
            </Flex>

            <Button
              size="md"
              radius="md"
              fullWidth
              disabled={allRequests.length === 0}
              onClick={() => addToServeInProgress(allRequests[serveIndex])}
            >
              Serve
            </Button>

            <Flex mt="md" justify="space-evenly" align="center" >
              <ActionIcon
                variant="filled"
                onClick={prevServeItem}
                disabled={serveIndex === 0}
                size="xl"
                radius="xl"
              >
                <ChevronLeftIcon />
              </ActionIcon>
              <Title order={4}>
                {allRequests.length === 0 ? 0 : serveIndex + 1} out of {allRequests.length}
              </Title>
              <ActionIcon
                variant="filled"
                onClick={nextServeItem}
                disabled={serveIndex === allRequests.length - 1 || allRequests.length === 0}
                size="xl"
                radius="xl"
              >
                <ChevronRightIcon />
              </ActionIcon>
            </Flex>
          </Flex>

        ) : (
          <Text my="md" c="dimmed">No items ready to serve</Text>
        )}

      </Box>
    </Box>
  );
}
