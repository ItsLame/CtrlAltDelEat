import { Button, Card, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { blacklistAuthToken, getUserCookies } from "@/services";
import { StaffInfoProps, loginSchema, userGroup } from "@/models";

export function StaffInfo({ onLogout }: StaffInfoProps) {
  const [username, setUsername] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [groups, setGroups] = useState([]);

  const form = useForm({
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  });

  const refreshUser = () => {
    getUserCookies().then((res) => {
      setUsername(res.username!);
      setIsSuperUser(res.isSuperUser === "true");
      if (res.groups != null) {
        const groups = JSON.parse(res.groups!).map((k: userGroup) => k.name);
        setGroups(groups);
      }
    });
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    blacklistAuthToken().then(() => {
      form.reset();
      onLogout();
    });
  };

  return (
    <Stack gap="xs">
      <Card withBorder radius="sm" shadow="md">
        <Stack gap={0}>
          <Text><Text span fw={500}>Username: </Text>{username}</Text>
          {isSuperUser && <Text><Text span fw={500}>SuperUser: </Text>Yes</Text>}
          <Text><Text span fw={500}>Group(s): </Text>{groups.length !== 0 ? groups.toString() : "No group"}</Text>
        </Stack>
      </Card>
      <Button variant="light" color="red" onClick={handleLogout}>
        Log Out
      </Button>
    </Stack>
  );
}