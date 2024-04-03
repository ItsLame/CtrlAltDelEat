import { reqAssistProps } from "@/models";
import { Button, Flex, Text, Title } from "@mantine/core";
import { useState } from "react";

export function RequestAssistance({
  allRequests,
  assistBtn,
  totalAssistLen,
}: reqAssistProps) {
  const [assistIndex, setAssistIndex] = useState(0);

  const nextAssist = () => {
    if (assistIndex < totalAssistLen - 1) {
      setAssistIndex((prev) => prev + 1);
    }
  };
  const prevAssist = () => {
    if (assistIndex > 0) {
      setAssistIndex((prev) => prev - 1);
    }
  };
  return (
    <section className="wait-grid-item request-grid">
      <Title order={1} m="md">
        Request Assitance
      </Title>

      <Flex
        h="70%"
        direction="column"
        justify="space-between"
        className="light-blue"
      >
        <Flex
          p="md"
          direction="column"
          gap="sm"
          className="card-container off-white"
          m="md"
        >
          <Flex justify="space-between">
            {allRequests.length > 0 ? (
              <Title className="table-requested">
                Table #{allRequests[assistIndex].tableNumber}
              </Title>
            ) : (
              <Title className="table-requested">None</Title>
            )}
          </Flex>
          <Button
            disabled={totalAssistLen === 0}
            onClick={() => {
              assistBtn(allRequests[assistIndex].tableNumber);
            }}
          >
            <Text size="md" c="white">
              Assist
            </Text>
          </Button>
        </Flex>

        <Flex p="lg" justify="space-evenly" align="center">
          <Button
            c="white"
            className="next-item-btn"
            onClick={() => prevAssist()}
            disabled={assistIndex === 0}
          >
            &lt;
          </Button>
          <Title order={4}>
            {totalAssistLen === 0 ? 0 : assistIndex + 1} out of {totalAssistLen}
          </Title>
          <Button
            c="white"
            className="next-item-btn"
            onClick={() => nextAssist()}
            disabled={
              assistIndex === allRequests.length - 1 || totalAssistLen === 0
            }
          >
            &gt;
          </Button>
        </Flex>
      </Flex>
    </section>
  );
}
