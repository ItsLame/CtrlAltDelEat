import { Button, Center, Stack, Flex, Title, PinInput, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";

import { generateAuthToken, storeToken, blacklistAuthToken, getUserCookies } from "@/services";
import { apiPassword } from "@/constants";
import { userGroup } from "@/models";

export function Login() {
  const [username, setUsername] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [groups, setGroups] = useState([]);
  const [errorPin, setErrorPin] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [pin, setPIN] = useState("");

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

  const handleLogin = (pin: string) => {
    generateAuthToken( { username: pin, password: apiPassword } ).then(
      (res) => {
        storeToken(res);
        setErrorPin(false);
        setErrorName("");
        refreshUser();
      }
    ).catch(() => {
      setErrorPin(true);
      setErrorName("Failed to authenticate");
    });
  };

  const handleLogout = () => {
    blacklistAuthToken().then(
      () => {
        setErrorName("");
        setPIN("");
        refreshUser();
      }
    );

  };

  const loginSection = () => (
    <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
      <><Stack>
        <PinInput
          onComplete={(value: string) => setPIN(value)}
          autoFocus
          error={errorPin}
          type={/^\d*$/}
          inputType="tel"
        />
        <Text>
          {errorName}
        </Text>
        <Button type="submit" variant="light" onClick={() => handleLogin(pin)}>
          Log in
        </Button>
      </Stack></>
    </form>
  );

  const logoutSection = () => (
    <>
      <Text><Text span fw={500}>Username: </Text>{username}</Text>
      <Text><Text span fw={500}>SuperUser: </Text>{isSuperUser ? "Yes" : "No"}</Text>
      <Text><Text span fw={500}>Groups: </Text>{groups.toString()}</Text>
      <Button variant="light" onClick={handleLogout}>
        Log out
      </Button>
    </>
  );

  return (
    <Center>
      <Flex direction="column" align="center">
        <Stack gap={5} align="center">
          <Title order={5} mt={20}>
            Authentication
          </Title>
          {!username ? loginSection() : logoutSection()}
        </Stack>
      </Flex>
    </Center>
  );
}
