"use client";

import Link from "next/link";
import { Image, Button, Center, Flex, Stack, Title, Box, NumberInput, LoadingOverlay, Text, ActionIcon } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { clearAuthRefreshTokens, generateAuthToken, getUserCookies, storeToken } from "@/services";
import { apiPassword, apiUser, siteRoute } from "@/constants";
import { StaffInfo, ThemeToggle } from "@/components";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export default function HomePage() {
  const isDevelopment = process.env.NODE_ENV === "development" ? true : false;

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [tableNo, setTableNo] = useState(1);

  const [isLoginLoading, setLoginLoading] = useState(true);
  const [isLogoAnimated, setLogoAnimated] = useState(false);

  const handleSuperLogin = () => {
    setLoginLoading(true);
    setLoggedIn(false);
    generateAuthToken({ username: apiUser, password: apiPassword }).then((res) => storeToken(res))
      .finally(() => {
        setLoggedIn(true);
        setLoginLoading(false);
      });
  };

  const handleLogout = () => {
    setLoginLoading(true);
    clearAuthRefreshTokens().finally(() => {
      setLoggedIn(false);
      setLoginLoading(false);
    });
  };

  useEffect(() => {
    setLoginLoading(true);
    getUserCookies().then((res) => setLoggedIn(res.username ? true : false)).finally(() => setLoginLoading(false));
  }, []);

  return (
    <Center>
      <Flex direction="column" align="center" mb="md">
        <Box mt={20}>
          <Image className={`${isLogoAnimated ? "animated-logo" : ""}`} w={200} src="logo.svg" alt="CtrlAltDelEat Logo" />
        </Box>

        <Title order={4} mt="lg">
          Theme
        </Title>
        <Stack gap={5}>
          <Flex gap="sm" align="center">
            <Text>Toggle Dark/Light Mode</Text>
            <ThemeToggle />
          </Flex>
          <Flex className="w-100" justify="space-between" align="center">
            <Text>Turn {isLogoAnimated ? "Off" : "On"} Logo Flicker</Text>
            <ActionIcon color="grape" variant="light" radius="xl" size="lg" onClick={() => setLogoAnimated(prev => !prev)}>
              {isLogoAnimated ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </ActionIcon>
          </Flex>
        </Stack>

        <Title order={4} mt="lg">
          Navigation
        </Title>
        <Stack className="root-navigation" gap={5} align="center" w={200}>
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
              w={100}
              min={1}
              onChange={(e) => setTableNo(e as number)}
            />
            <Link href={`${siteRoute.customer}/${tableNo}`}>
              <Button disabled={tableNo <= 0 ? true : false}>Customer</Button>
            </Link>
          </Flex>
        </Stack>

        <Title order={4} mt="lg">
          {!isLoggedIn ? "Staff Login" : "Staff Detail"}
        </Title>
        <Box className="w-100" pos="relative">
          <LoadingOverlay zIndex={1000} visible={isLoginLoading}/>
          {!isLoggedIn ? (
            <Link className="w-100" href={siteRoute.auth}>
              <Button className="w-100" variant="light">
                Login
              </Button>
            </Link>
          ) : (
            <StaffInfo onLogout={handleLogout}/>
          )}
        </Box>

        {/* Note: Developer tool only available on development environment (won't appear in prod) */}
        {isDevelopment && (
          <>
            <Title order={4} mt="lg">
              Developer Tool
            </Title>
            <Button variant="light" onClick={handleSuperLogin} fullWidth>
              Super Authenticate
            </Button>
          </>
        )}
      </Flex>

      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
    </Center>
  );
}
