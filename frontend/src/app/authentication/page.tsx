"use client";

import { Flex } from "@mantine/core";
import { useRouter } from "next/navigation";

import { Login } from "@/components";
import { siteRoute } from "@/constants";

export default function LoginPage() {
  const router = useRouter();

  const handleBackToNavigation = () => router.push(siteRoute.root);

  return (
    <Flex direction="column" align="center">
      <Login onReturn={handleBackToNavigation}/>
    </Flex>
  );
}
