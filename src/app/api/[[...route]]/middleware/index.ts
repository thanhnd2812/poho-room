import { getSession } from "@/lib/session";
import { Context, Next } from "hono";

export const sessionCheck = () => {
  return async (c: Context, next: Next) => {
    const session = await getSession();
    
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Add session to context for use in subsequent handlers
    c.set("session", session);

    await next();
  };
};
