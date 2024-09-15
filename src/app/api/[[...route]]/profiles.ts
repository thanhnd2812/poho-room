import { getUserById } from "@/lib/dal/user";

import { Context, Hono } from "hono";
import { JWTPayload } from "jose";

interface CustomContext extends Context {
  get(key: "session"): JWTPayload;
}

const app = new Hono().get("/me", async (c: CustomContext) => {
  const session = c.get("session");
  const { id } = session;
  if (!id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401
    );
  }
  
  const user = await getUserById(id as string);

  if (!user) {
    return c.json(
      {
        success: false,
        message: "User not found",
      },
      404
    );
  }
  return c.json({
    success: true,
    data: user,
  });
});

export default app;
