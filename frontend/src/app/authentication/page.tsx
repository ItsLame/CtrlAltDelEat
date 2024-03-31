"use client";

import { Center, Flex } from "@mantine/core";
import { Login } from "@/components";

export default function LoginPage() {
  return (
    <Center>
      <Flex direction="column" align="center">
        <Login/>
      </Flex>
    </Center>
  );
}