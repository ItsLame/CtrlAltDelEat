"use client";
// import Link from "next/link";

import { Center, Flex } from "@mantine/core";
import { Login } from "@/components";
import { useCookies } from "next-client-cookies";

import { usernameCookieName } from "@/constants";

export default function LoginPage() {
  // refreshAuthToken();
  const cookies = useCookies();
  const username = cookies.get(usernameCookieName);
  console.log("username", cookies.get('username'));

  return (
    <Center>
      <Flex direction="column" align="center">
        <Login/>
      </Flex>
    </Center>
  );
}
