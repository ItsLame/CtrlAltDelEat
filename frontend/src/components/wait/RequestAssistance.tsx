import { reqAssistProps } from "@/models";
import { ActionIcon, Box, Button, Card, Flex, Text, Title } from "@mantine/core";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function RequestAssistance({ allRequests, addAssistToProgress }: reqAssistProps) {
  const [assistIndex, setAssistIndex] = useState(0);

  const checkEndOfList = () => (assistIndex !== 0 && assistIndex === allRequests.length - 1) && setAssistIndex(allRequests.length - 2);

  const nextAssist = () => assistIndex < allRequests.length - 1 && setAssistIndex((prev) => prev + 1);
  const prevAssist = () => assistIndex > 0 && setAssistIndex((prev) => prev - 1);

  return (
    <Box className="h-50" m="md">
      <Title order={2} mb="xs">
        Request Assistance
      </Title>

      {allRequests.length > 0 && assistIndex < allRequests.length ? (
        <>
          <Card
            className="w-100"
            radius="md"
            p="sm"
            mb="sm"
            withBorder
            shadow="sm"
          >
            <Flex justify="space-between" py="xs">
              <Text> Table No: {allRequests[assistIndex].tableNumber}</Text>
              <Text c="red">
                Requested on: {allRequests[assistIndex].timestamp.slice(0, 8)}
              </Text>
            </Flex>

          </Card>
          <Button
            size="md"
            radius="md"
            fullWidth
            disabled={allRequests.length === 0}
            onClick={() => {
              addAssistToProgress(allRequests[assistIndex].tableNumber, allRequests[assistIndex].timestamp.slice(0, 9));
              checkEndOfList();
            }}
            aria-label={`Assist table number ${allRequests[assistIndex].tableNumber}, requested on ${allRequests[assistIndex].timestamp.slice(0, 9)}`}
          >
            Assist
          </Button>

          <Flex mt="md" justify="space-evenly" align="center" >
            <ActionIcon
              variant="filled"
              onClick={prevAssist}
              disabled={assistIndex === 0}
              size="xl"
              radius="xl"
              aria-label="Press enter to go to next  assistance request"
            >
              <ChevronLeftIcon />
            </ActionIcon>

            <Title order={4}>
              {allRequests.length === 0 ? 0 : assistIndex + 1} out of {allRequests.length}
            </Title>

            <ActionIcon
              variant="filled"
              onClick={nextAssist}
              disabled={assistIndex === allRequests.length - 1 || allRequests.length === 0}
              size="xl"
              radius="xl"
              aria-label="Press enter to go to previous assistance request"
            >
              <ChevronRightIcon />
            </ActionIcon>
          </Flex>
        </>
      ) : <Text my="md" c="dimmed">No assistance required</Text>}
    </Box>
  );
}
