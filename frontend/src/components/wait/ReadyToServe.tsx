import { Button, Text, Flex, Title, Box } from "@mantine/core";

export function ReadyToServe() {
  return (
    <section className="wait-grid-item serve-grid">
      <Title order={1} m="md">
        Ready To Be served
      </Title>

      <Box className="light-blue">
        <Flex direction="column" justify="space-between">
          <Flex direction="column" px="md" pt="sm" justify="start">
            <Flex justify="space-between" mb="sm">
              <Flex direction="column">
                <Title order={4}>🍔</Title>
                {/* <Title order={4}>Table #02</Title> */}
                {/* <Title order={4}>Order #016</Title> */}
              </Flex>
              {/* <Title order={4}>Ready on 16:21:21🛠️</Title> */}
              <Title order={4}>🛠️</Title>
            </Flex>
            <Box px="sm" className="off-white">
              <Title order={1} ta="center" pb="sm">
                🛠️ Under Construction 🚧{" "}
              </Title>
            </Box>
          </Flex>
          <Button mx="md" mb="sm" mt="sm" disabled>
            <Text size="md" c="white">
              Serve
            </Text>
          </Button>
        </Flex>

        <Flex p="lg" justify="space-evenly" align="center">
          <Button disabled className="next-item-btn" c="white">
            &lt;
          </Button>
          <Title order={4}>0 out of 0</Title>
          <Button disabled className="next-item-btn" c="white">
            &gt;
          </Button>
        </Flex>
      </Box>
    </section>
  );
}
