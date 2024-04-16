import { Badge, Blockquote, Box, Button, Card, Flex, Text, Title } from "@mantine/core";

import { inProgProps, statusType } from "@/models";

export function InProgress({
  allRequests,
  assistUndo,
  assistUpdate,
  serveUndo,
  serveUpdate,
  refreshAssist,
  refreshServe,
}: inProgProps) {

  return (
    <Box className="appshell-h-100">
      <Title order={2} my="xs">
        In Progress
      </Title>

      <Box className="progress-container">
        <Flex
          className="prog-align-content bordered br-10"
          direction={{ base: "row", sm: "row", md: "column" }}
          gap="sm"
          justify="start"
          h={{ md: "100%" }}
          wrap="wrap"
          p="sm"
        >
          {allRequests.length > 0 ? allRequests.map ((req, key) => (
            <Card
              key={key}
              className="prog-item-card w-100"
              radius="md"
              shadow="sm"
              withBorder
            >
              {req.reqType === statusType.assist ? (
                <>
                  <Badge color="grape" size="xl" fullWidth>Status: ASSISTING</Badge>
                  <Flex py="sm" justify="space-between" className="order-first-line w-100" >
                    <Text size="md">Table No: {req.tableNumber}</Text>
                    <Text size="md" c="red">
                      Requested on: {req.timestamp.slice(0, req.timestamp.indexOf("."))}
                    </Text>
                  </Flex>

                  <Flex className="w-100" gap="sm">
                    <Button
                      fullWidth
                      variant="outline"
                      color="gray"
                      onClick={() => assistUndo(req.tableNumber)}
                      aria-label={`Put assistance request for table number ${req.tableNumber} back to queue`}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        assistUpdate(req.tableNumber);
                        refreshAssist();
                      }}
                      aria-label={`Successfully assisted table number ${req.tableNumber}`}
                    >
                      Complete
                    </Button>
                  </Flex>
                </>
              ) : (
                <>
                  <Badge color="green" size="xl" fullWidth>Status: SERVING</Badge>
                  <Flex pt="sm" justify="space-between" className="order-first-line w-100" >
                    <Text size="md">Table No: {req.tableNumber}</Text>
                    <Text size="md" c="red">
                      Ready on: {req.timestamp.slice(0, req.timestamp.indexOf("."))}
                    </Text>
                  </Flex>

                  <Text size="md" mb="xs">Item No: {req.itemID}</Text>

                  <Box className="order-items" p="xs" mb="sm">
                    <Flex justify="space-between">
                      <Title className="item-name" order={5} textWrap="balance">{req.itemName}</Title>
                      <Title order={4}>x {req.quantity}</Title>
                    </Flex>
                    {req.alterations !== "" &&
                      <Blockquote p={0} pl="xs" c="dimmed" fs="italic">{req.alterations}</Blockquote>
                    }
                  </Box>

                  <Flex className="w-100" gap="sm">
                    <Button
                      fullWidth
                      variant="outline"
                      color="gray"
                      onClick={() => serveUndo(req.itemID)}
                      aria-label={`Put order  ${req.quantity} ${req.itemName} for table number ${req.tableNumber} back to queue`}
                    >
                      Cancel
                    </Button>

                    <Button
                      fullWidth
                      onClick={() => {
                        serveUpdate(req.itemID, req.tableNumber);
                        refreshServe();
                      }}
                      aria-label={`Completed order ${req.quantity} ${req.itemName} for table number ${req.tableNumber}`}
                    >
                      Complete
                    </Button>
                  </Flex>
                </>
              )}
            </Card>
          )): <Text m="md" c="dimmed">No items serving or tables assisting right now.</Text>}
        </Flex>
      </Box>
    </Box>
  );
}
