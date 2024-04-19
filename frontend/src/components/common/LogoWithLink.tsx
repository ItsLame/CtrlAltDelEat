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
      alt="CtrlAltDelEat Logo"
      h={45}
      onClick={handleBackToNavigation}
      onKeyDown={(e) => e.key === "Enter" && handleBackToNavigation}
      tabIndex={0}
      aria-label="Press enter to go back to navigation page"
    />
  );
};
