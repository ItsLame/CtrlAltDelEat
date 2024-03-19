// import Link from "next/link";

import { Button, Center, Stack, Flex, Title, PinInput } from "@mantine/core";
import { useState } from "react";
import { generateAuthToken, storeToken } from "@/services";
import { apiPassword } from "@/constants";
export function Login() {
  const handleLogin = (pin: any) => {
    generateAuthToken( { username: pin, password: apiPassword } ).then(
      (res) => {
        console.log(res);
        storeToken(res);
        console.log("Test2");
      }
    );
  };
  const [pin, setPIN] = useState("");
  return (
    <Center>
      <Flex direction="column" align="center">
        <Stack gap={5} align="center">
          <Title order={5} mt={20}>
            Authentication
          </Title>
          <><PinInput
            onComplete={(value: any) => setPIN(value)} />
          <Button variant="light" onClick={() => handleLogin(pin)}>
            Log in
          </Button></>
        </Stack>
      </Flex>
    </Center>
  );
}
