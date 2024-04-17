import { Button, Card, Code, Flex, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";

import { blacklistAuthToken, getUserCookies } from "@/services";
import { StaffInfoProps, userGroup } from "@/models";

export function StaffInfo({ onLogout }: StaffInfoProps) {
  const [username, setUsername] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [groups, setGroups] = useState([]);

  const refreshUser = () => {
    getUserCookies().then((res) => {
      setUsername(res.username!);
      setIsSuperUser(res.isSuperUser === "true");
      if (res.groups != null) {
        const groups = JSON.parse(res.groups!).map((u: userGroup) => u.name);
        setGroups(groups);
      }
    });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    blacklistAuthToken().then(() => onLogout());
  };

  return (
    <Stack className="w-100" gap="xs" align="center">
      <Card className="w-100" withBorder radius="sm" shadow="md">
        <Stack gap="xs">
          <Flex justify="space-between">
            <Text span fw={600}>Username:</Text>
            <Code>{username}</Code>
          </Flex>
          {isSuperUser && (
            <Flex justify="space-between">
              <Text span fw={600}>SuperUser:</Text>
              <Code>Yes</Code>
            </Flex>
          )}
          <Flex justify="space-between">
            <Text span fw={600}>Group(s):</Text>
            <Code>{groups.length !== 0 ? groups.toString() : "No group"}</Code>
          </Flex>
        </Stack>
      </Card>
      <Button variant="light" color="red" onClick={handleLogout} fullWidth>
        Logout
      </Button>
    </Stack>
  );
}
