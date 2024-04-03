import { assistRequests, inProgProps } from "@/models";
import { Box, Button, Flex, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export function InProgress({
  toAssistRequests,
  toServeRequests,
  assistUndo,
  assistUpdate,
  serveUndo,
  serveUpdate,
  refreshAssist,
  refreshServe,
}: inProgProps) {
  const [inProg, setInProg] = useState([] as assistRequests[]);

  useEffect(() => {
    setInProg(
      toAssistRequests.filter((item) => item.request_assistance === true)
    );
  }, [toAssistRequests]);

  return (
    <section className="wait-grid-item progress-grid ">
      <Title order={1} m="md">
        In Progress
      </Title>
      <Flex
        mih="90%"
        mah="90%"
        direction="column"
        gap="sm"
        align="flex-start"
        justify="start"
        className="progress-container"
        p="md"
        wrap="wrap"
      >
        {inProg.map((req) => (
          <Flex
            key={req.tableNumber}
            direction="column"
            className="wait-card"
            w="25rem"
            p="md"
          >
            <Title order={2} className="status assist">
              Status : ASSIST
            </Title>
            <Title order={3} mt="sm" ta="center">
              Table #{req.tableNumber}
            </Title>
            <Flex justify="space-evenly">
              <Button
                size="md"
                w="45%"
                mt="md"
                onClick={() => assistUndo(req.tableNumber)}
              >
                Cancel
              </Button>
              <Button
                size="md"
                w="45%"
                mt="md"
                onClick={() => {
                  assistUpdate(req.tableNumber);
                  refreshAssist();
                }}
              >
                Complete
              </Button>
            </Flex>
          </Flex>
        ))}
        {toServeRequests.map((req) => (
          <Flex
            key={req.id}
            direction="column"
            className="wait-card"
            w="25rem"
            p="md"
          >
            <Title order={3} className="status serve" mb="sm">
              Status : SERVE
            </Title>

            <Flex justify="space-between" mb="sm">
              <Box>
                <Title order={3}>Table #{req.tableNumber}</Title>
                <Title order={3}>Table #{req.id}</Title>
              </Box>
              <Title order={3} c="red">
                Ready on {req.timestamp.slice(0, req.timestamp.indexOf("."))}
              </Title>
            </Flex>

            <Title order={3}>
              {" "}
              {req.quantity} x {req.itemName}
            </Title>

            <Flex justify="space-evenly">
              <Button size="md" w="45%" mt="md" onClick={() => serveUndo(req)}>
                Cancel
              </Button>

              <Button
                size="md"
                w="45%"
                mt="md"
                onClick={() => {
                  serveUpdate(req);
                  refreshServe();
                }}
              >
                Complete
              </Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </section>
  );
}
