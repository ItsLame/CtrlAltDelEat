import { assistRequests, inProgProps } from "@/models";
import { Button, Flex, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export function InProgress({
  allRequests,
  assistUndo,
  assistUpdate,
  refreshFunc,
}: inProgProps) {
  const [inProg, setInProg] = useState([] as assistRequests[]);

  useEffect(() => {
    setInProg(allRequests.filter((item) => item.request_assistance === true));
  }, [allRequests]);

  return (
    <section className="wait-grid-item progress-grid ">
      <Title order={1} m="md">
        In Progress
      </Title>
      <Flex
        mih="90%"
        mah="90%"
        direction="column"
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
            <Title order={2} className="status-assist">
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
                  refreshFunc();
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
