import { Activated } from "../staticPages/activated";
import { AppRoute } from "../App";
import { DeleteAccount } from "../staticPages/deleteAccount";
import { Reactivated } from "../staticPages/reactivated";
import { ReactivationConfirmed } from "../staticPages/reactivationConfirmed";
import { ReactivationRejected } from "../staticPages/reactivationRejected";
import { Rejected } from "../staticPages/rejected";
import { Route } from "@tanstack/react-router";
import { Support } from "../staticPages/support";
import { Welcome } from "../staticPages/welcome";

export const welcomeRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/",
  component: Welcome,
});

export const activatedRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/activate",
  component: Activated,
});

export const deleteAccountRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/deleteAccount",
  component: DeleteAccount,
});

export const reactivatedRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/reactivate",
  component: Reactivated,
});

export const reactivationConfirmedRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/reactivation-confirmed",
  component: ReactivationConfirmed,
});

export const reactivationRejectedRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/reactivation-rejected",
  component: ReactivationRejected,
});

export const rejectedRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/rejected",
  component: Rejected,
});

export const supportRoute = new Route({
  getParentRoute: () => AppRoute,
  path: "/support",
  component: Support,
});
