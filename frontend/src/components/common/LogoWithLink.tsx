import { Image } from "@mantine/core";
import { useRouter } from "next/navigation";

import { siteRoute } from "@/constants";

export const LogoWithLink = () => {
  const router = useRouter();

  const handleBackToNavigation = () => router.push(siteRoute.root);

  return (
    <Image
      className="logo pointer"
      src="logo.svg"
      h={45}
      alt="CtrlAltDelEat Logo"
      onClick={handleBackToNavigation}
    />
  );
};
