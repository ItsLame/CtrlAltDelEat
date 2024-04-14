"use client";

import { Flex } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

import { Login } from "@/components";
import { siteRoute } from "@/constants";

export default function LoginPage() {
  const router = useRouter();

  const handleBackToNavigation = () => router.push(siteRoute.root);

  return (
    <Flex direction="column" align="center">
      <Login onReturn={handleBackToNavigation}/>
      <Toaster position="top-center" toastOptions={{ duration: 1500 }}/>
    </Flex>
  );
}
