import toast from "react-hot-toast";

import { siteRoute } from "@/constants";
import { userType } from "@/models";
import { clearAuthRefreshTokens } from "@/services";

export function mapUserToRoute (name: userType) {
  switch(name) {
  case userType.manager: return siteRoute.manager;
  case userType.kitchenStaff: return siteRoute.kitchen;
  case userType.waitStaff: return siteRoute.wait;
  case userType.customer: return `${siteRoute.customer}/1`;
  default: return siteRoute.root;
  }
};

export function noPermissionToast() {
  toast.error("No permission to view this page!", { duration: 500 });
  toast.loading("Redirecting to login page...", { duration: 1000 });
}

export async function genericLogout() {
  clearAuthRefreshTokens().finally(() => {
    toast("Logged out!", { duration: 1000 });
  });
};
