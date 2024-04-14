import { siteRoute } from "@/constants";
import { genericLogout } from "@/helpers";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    genericLogout().then(() => router.push(siteRoute.root));
  };

  return (
    <Button onClick={handleLogout} variant="light" color="red">
      Logout
    </Button>
  );
};
