export const runtime = "nodejs";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { sessionCheck } from "./middleware";
import profileRoutes from "./profiles";
import roomsRoutes from "./rooms";
import authRoutes from "./users";

const publicApiRoutes = [
  "/auth/email-login",
  "/auth/phone-login",
  "/auth/google-login",
  "/auth/forgot-password",
  "auth/verify-email",
];

const app = new Hono().basePath("/api");

app.use("*", (c, next) => {
  if (publicApiRoutes.some((route) => c.req.url.includes(route))) {
    return next();
  }
  return sessionCheck()(c, next);
});

const routes = app
  .route("/auth", authRoutes)
  .route("/profiles", profileRoutes)
  .route("/rooms", roomsRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
