"use client";

import Link from "next/link";
import { Image, Button, Center, Flex, Stack, Title, Box, NumberInput, LoadingOverlay, Text, ActionIcon } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { clearAuthRefreshTokens, generateAuthToken, getUserCookies, storeToken } from "@/services";
import { apiPassword, apiUser, siteRoute } from "@/constants";
import { StaffInfo, ThemeToggle } from "@/components";

export default function HomePage() {
  const isDevelopment = process.env.NODE_ENV === "development" ? true : false;

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [tableNo, setTableNo] = useState(1);

  const [isLoginLoading, setLoginLoading] = useState(true);
  const [isLogoAnimated, setLogoAnimated] = useState(true);

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
            <ActionIcon color="grape" variant="light" radius="xl" size="lg"
              onClick={() => setLogoAnimated(prev => !prev)}
              aria-label="Toggle logo flicker animation"
            >
              {isLogoAnimated ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </ActionIcon>
          </Flex>
        </Stack>

        <Title order={4} mt="lg">
          Navigation
        </Title>
        <Stack className="root-navigation" gap={5} align="center" w={200}>
          <Link href={siteRoute.manager} aria-label="Press enter to navigate to manager page">
            <Button tabIndex={-1}>Manager</Button>
          </Link>
          <Link href={siteRoute.kitchen} aria-label="Press enter to navigate to kitchen staff page">
            <Button tabIndex={-1}>Kitchen</Button>
          </Link>
          <Link href={siteRoute.wait} aria-label="Press enter to navigate to wait staff page">
            <Button tabIndex={-1}>Wait Staff</Button>
          </Link>
          <Flex gap={10}>
            <NumberInput
              defaultValue={1}
              w={100}
              min={1}
              allowNegative={false}
              allowDecimal={false}
              onChange={(e) => setTableNo(e as number)}
              aria-label="Enter table number for customer"
            />
            <Link href={`${siteRoute.customer}/${tableNo}`} aria-label="Press enter to navigate to wait staff page">
              <Button tabIndex={-1} disabled={tableNo <= 0 ? true : false}>
                Customer
              </Button>
            </Link>
          </Flex>
        </Stack>

        <Title order={4} mt="lg">
          {!isLoggedIn ? "Staff Login" : "Staff Detail"}
        </Title>
        <Box className="w-100" pos="relative">
          <LoadingOverlay zIndex={1000} visible={isLoginLoading}/>
          {!isLoggedIn ? (
            <Link href={siteRoute.auth}>
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
