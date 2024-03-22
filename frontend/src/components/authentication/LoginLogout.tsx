// import Link from "next/link";

import { Button, Center, Stack, Flex, Title, PinInput, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { generateAuthToken, storeToken, logout, getUserCookies } from "@/services";
import { apiPassword } from "@/constants";
import { userGroup } from "@/models";
import { useForm } from "@mantine/form";

export function Login() {
  const [username, setUsername] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [groups, setGroups] = useState([]);
  const [errorPin, setErrorPin] = useState(false);
  const [errorName, setErrorName] = useState("");

  const form = useForm({
    initialValues: {
      pin: "",
    }
  });
  const refreshUser = () => {
    getUserCookies().then((res) => {
      setUsername(res.username!);
      setIsSuperUser(res.isSuperUser == "true");
      if (res.groups != null) {
        const groups = JSON.parse(res.groups!).map(
          (k: userGroup) => k.name
        );
        setGroups(groups);
      }
    });
  };
  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogin = (pin: any) => {
    generateAuthToken( { username: pin, password: apiPassword } ).then(
      (res) => {
        console.log(res);
        storeToken(res);
        setErrorPin(false);

        refreshUser();
      }
    ).catch((error) => {
      console.log(error);
      setErrorPin(true);
      setErrorName("Failed to authenticate");
    });
  };

  const handleLogout = () => {
    logout().then(
      () => {
        refreshUser();
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
          {!username ?
            (
              <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
                <><Stack>
                  <PinInput
                    onComplete={(value: any) => setPIN(value)}
                    autoFocus
                    error={errorPin}/>
                  <Text>
                    {errorName}
                  </Text>
                  <Button type="submit" variant="light" onClick={() => handleLogin(pin)}>
                    Log in
                  </Button>
                </Stack></>
              </form>
            ) :
            (
              <><Text><Text span fw={500}>Username: </Text>{username}</Text>
                <Text><Text span fw={500}>SuperUser: </Text>{isSuperUser ? "Yes" : "No"}</Text>
                <Text><Text span fw={500}>Groups: </Text>{groups}</Text>
                <Button variant="light" onClick={handleLogout}>
                  Log out
                </Button></>
            )
          }
        </Stack>
      </Flex>
    </Center>
  );
}
