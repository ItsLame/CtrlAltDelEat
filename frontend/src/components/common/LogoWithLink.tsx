import { Image } from "@mantine/core";
import { useRouter } from "next/navigation";

import { siteRoute } from "@/constants";

export const LogoWithLink = () => {
  const router = useRouter();

  const handleBackToNavigation = () => router.push(siteRoute.root);

  return (
    <Image
      className="logo link pointer"
      src="logo.svg"
      h={45}
      alt="CtrlAltDelEat Logo"
      aria-label="Press enter to   go back to navigation page"
      tabIndex={0}
      onClick={handleBackToNavigation}
      onKeyDown={(e) => e.key === "Enter" && handleBackToNavigation}
    />
  );
};
