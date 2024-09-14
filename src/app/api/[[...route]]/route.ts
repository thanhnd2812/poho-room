export const runtime = "nodejs";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRoutes from "./users";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", authRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;