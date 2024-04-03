"use client";

import Link from "next/link";
import {
  Image,
  Button,
  Center,
  Flex,
  Stack,
  Title,
  Box,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";

import { generateAuthToken, storeToken } from "@/services";
import { apiPassword, apiUser } from "@/constants";

export default function HomePage() {
  const [tableNo, setTableNo] = useState(1);

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
        <Stack gap={5} align="center">
          <Link href="/manager">
            <Button>Manager</Button>
          </Link>
          <Link href="/kitchen">
            <Button>Kitchen</Button>
          </Link>
          <Link href="/wait">
            <Button>Wait Staff</Button>
          </Link>
          <Flex gap={10}>
            <NumberInput
              defaultValue={1}
              w={70}
              min={1}
              onChange={(e) => {
                setTableNo(e as number);
              }}
            />
            <Link href={`/customer/${tableNo}`}>
              <Button>Customer</Button>
            </Link>
          </Flex>
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
