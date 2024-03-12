"use client";

import Link from "next/link";
import { Image, Button, Center, Flex, Stack, Title, Box } from "@mantine/core";

import { generateAuthToken, storeToken } from "@/services";
import { apiPassword, apiUser } from "@/constants";

export default function HomePage() {
  const handleLogin = () => {
    generateAuthToken({ username: apiUser, password: apiPassword }).then(
      (res) => {
        storeToken(res);
      }
    );
  };

  return (
    <Center>
      <Flex direction="column" align="center">
        <Box w={200} mt={50} mb={50}>
          <Image src="logo.svg" alt="CtrlAltDelEat Logo" />
        </Box>
        <Title order={5}>Navigation</Title>
        <Stack gap={10}>
          <Link href="/manager">
            <Button>Manager</Button>
          </Link>
          <Link href="/kitchen">
            <Button>Kitchen</Button>
          </Link>
          <Link href="/customer">
            <Button>
              Customer
            </Button>
          </Link>
        </Stack>
        <Title order={5} mt={20}>
          Developer Tool
        </Title>
        <Button variant="light" onClick={handleLogin}>
          Authenticate
        </Button>
      </Flex>
    </Center>
  );
}
