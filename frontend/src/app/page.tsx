"use client";

import Link from "next/link";
import { Image, Button, Center, Flex, Stack, Title, Box, NumberInput } from "@mantine/core";
import { useEffect, useState } from "react";

import { clearAuthRefreshTokens, generateAuthToken, getUserCookies, storeToken } from "@/services";
import { apiPassword, apiUser, siteRoute } from "@/constants";
import { StaffInfo } from "@/components";

export default function HomePage() {
  const isLocalHost = location?.hostname === "localhost" ? true : false;

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [tableNo, setTableNo] = useState(1);

  const handleSuperLogin = () => {
    setLoggedIn(false);
    generateAuthToken({ username: apiUser, password: apiPassword }).then((res) => storeToken(res)).finally(() => setLoggedIn(true));
  };

  const handleLogout = () => {
    clearAuthRefreshTokens();
    setLoggedIn(false);
  };

  useEffect(() => {
    getUserCookies().then((res) => setLoggedIn(res.username ? true : false));
  }, []);

  return (
    <Center>
      <Flex direction="column" align="center">
        <Box mt={50} mb={50}>
          <Image w={200} src="logo.svg" alt="CtrlAltDelEat Logo" />
        </Box>
        <Title order={5}>Navigation</Title>
        <Stack gap={5} align="center">
          <Link href={siteRoute.manager}>
            <Button>Manager</Button>
          </Link>
          <Link href={siteRoute.kitchen}>
            <Button>Kitchen</Button>
          </Link>
          <Link href={siteRoute.wait}>
            <Button>Wait Staff</Button>
          </Link>
          <Flex gap={10}>
            <NumberInput
              defaultValue={1}
              w={70}
              min={1}
              onChange={(e) => setTableNo(e as number)}
            />
            <Link href={`${siteRoute.customer}/${tableNo}`}>
              <Button disabled={tableNo <= 0 ? true : false}>Customer</Button>
            </Link>
          </Flex>
        </Stack>
        <Title order={5} mt="xl">
          {!isLoggedIn ? "Staff Login" : "Staff Detail"}
        </Title>
        {!isLoggedIn ? (
          <Link href={siteRoute.auth}>
            <Button variant="light">
                Login
            </Button>
          </Link>
        ) : (
          <StaffInfo onLogout={handleLogout}/>
        )}

        {/* Note: Developer tool only available on localhost */}
        {isLocalHost && (
          <>
            <Title order={5} mt="lg">
              Developer Tool
            </Title>
            <Button variant="light" onClick={handleSuperLogin}>
              Super Authenticate
            </Button>
          </>
        )}
      </Flex>
    </Center>
  );
}
