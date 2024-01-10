import {
  activatedRoute,
  deleteAccountRoute,
  reactivatedRoute,
  reactivationConfirmedRoute,
  reactivationRejectedRoute,
  rejectedRoute,
  supportRoute,
  welcomeRoute,
} from "./routes";

import { AppRoute } from "../App";
import { Router } from "@tanstack/react-router";

const routeTree = AppRoute.addChildren([
  welcomeRoute,
  activatedRoute,
  deleteAccountRoute,
  reactivatedRoute,
  reactivationConfirmedRoute,
  reactivationRejectedRoute,
  rejectedRoute,
  supportRoute,
]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
