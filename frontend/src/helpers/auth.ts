import { siteRoute } from "@/constants";
import { userType } from "@/models";

export const mapUserToRoute = (name: userType) => {
  switch(name) {
  case userType.manager: return siteRoute.manager;
  case userType.kitchenStaff: return siteRoute.kitchen;
  case userType.waitStaff: return siteRoute.wait;
  case userType.customer: return `${siteRoute.customer}/1`;
  default: return siteRoute.root;
  }
};
