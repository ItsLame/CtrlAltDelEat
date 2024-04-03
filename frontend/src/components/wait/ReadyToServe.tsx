import { serveProps } from "@/models";
import { Button, Text, Flex, Title, Box } from "@mantine/core";
import { useState } from "react";

export function ReadyToServe({
  allRequests,
  addToServeInProgress,
  totalServeLen,
}: serveProps) {
  const [serveIndex, setServeIndex] = useState(0);

  const nextServeItem = () => {
    if (serveIndex < totalServeLen - 1) {
      setServeIndex((prev) => prev + 1);
    }
  };
  const prevServeItem = () => {
    if (serveIndex > 0) {
      setServeIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="wait-grid-item serve-grid">
      <Title order={1} m="md">
        Ready To Be served
      </Title>
      <Box className="light-blue">
        <Flex direction="column" justify="space-between">
          <Flex direction="column" px="md" pt="sm" justify="start">
            {allRequests.length > 0 ? (
              <Flex justify="space-between" mb="sm">
                <Flex direction="column">
                  <Title order={4}>
                    Table # {allRequests[serveIndex].tableNumber}
                  </Title>
                  <Title order={4}>Item # {allRequests[serveIndex].id}</Title>
                </Flex>

                <Title order={4} c="red">
                  Ready on{" "}
                  {allRequests[serveIndex].timestamp.slice(
                    0,
                    allRequests[serveIndex].timestamp.indexOf(".")
                  )}
                </Title>
              </Flex>
            ) : (
              <Flex justify="space-between" mb="sm">
                <Flex direction="column">
                  <Title order={4}></Title>
                  <Title order={4}></Title>
                </Flex>

                <Title order={4} c="red"></Title>
              </Flex>
            )}

            <Box px="sm" className="off-white">
              {allRequests.length > 0 ? (
                <Title order={2} pb="sm">
                  {allRequests[serveIndex].quantity} x{" "}
                  {allRequests[serveIndex].itemName}
                </Title>
              ) : (
                <Title order={2} pb="sm">
                  None
                </Title>
              )}
            </Box>
          </Flex>
          <Button mx="md"
            mb="sm"
            mt="sm"
            onClick={() => addToServeInProgress(allRequests[serveIndex])}
          >
            <Text size="md" c="white">
              Serve
            </Text>
          </Button>
        </Flex>

        <Flex p="lg" justify="space-evenly" align="center">
          <Button
            className="next-item-btn"
            c="white"
            onClick={prevServeItem}
            disabled={serveIndex === 0}
          >
            &lt;
          </Button>
          <Title order={4}>
            {totalServeLen === 0 ? 0 : serveIndex + 1} out of {totalServeLen}
          </Title>
          <Button
            className="next-item-btn"
            c="white"
            onClick={nextServeItem}
            disabled={
              serveIndex === allRequests.length - 1 || totalServeLen === 0
            }
          >
            &gt;
          </Button>
        </Flex>
      </Box>
    </section>
  );
}
