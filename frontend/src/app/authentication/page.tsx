"use client";
// import Link from "next/link";

import { useDisclosure } from "@mantine/hooks";
import { Image, Button, Center, Stack, Flex, Title, Box, TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";

import { generateAuthToken, storeToken, logout } from "@/services";

export default function LoginPage() {
  // refreshAuthToken();
  const handleLogin = (username: any, password: any) => {
    generateAuthToken( { username: username, password: password } ).then(
      (res) => {
        console.log(username, password);
        storeToken(res);
        console.log("Stored token");
        setLoggedIn(true);
      }
    );
  };
  const handleLogout = () => {
    console.log("Logging out");
    logout();
    setLoggedIn(false);
  };
  const [visible, { toggle }] = useDisclosure(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  console.log(loggedIn);
  return (
    <Center>
      <Flex direction="column" align="center">
        <Box w={200} mt={50} mb={50}>
          <Image src="logo.svg" alt="CtrlAltDelEat Logo" />
        </Box>
        <Stack gap={5} align="center">
          <Title order={5} mt={20}>
            Authentication
          </Title>
          <><TextInput
              label="Username"
              placeholder="Username"
              onChange={(event: any) => setUsername(event.currentTarget.value)} />
            <PasswordInput
              label="Password"
              placeholder="Password"
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(event: any) => setPassword(event.currentTarget.value)} />
            <Button variant="light" onClick={() => handleLogin(username, password)}>
              Log in
            </Button></>
            <><Button variant="light" onClick={handleLogout}>
              Log out
            </Button></>
          {/* {(!loggedIn
            ?
            (
              <><TextInput
                label="Username"
                placeholder="Username"
                onChange={(event: any) => setUsername(event.currentTarget.value)} />
              <PasswordInput
                label="Password"
                placeholder="Password"
                visible={visible}
                onVisibilityChange={toggle}
                onChange={(event: any) => setPassword(event.currentTarget.value)} />
              <Button variant="light" onClick={() => handleLogin(username, password)}>
                Log in
              </Button></>
            )
            :
            (
              <><Button variant="light" onClick={handleLogout}>
                Log out
              </Button></>
            )
          )} */}
        </Stack>
      </Flex>
    </Center>
  );
}
