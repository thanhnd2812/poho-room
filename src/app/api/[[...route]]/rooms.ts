import { StreamClient } from "@stream-io/node-sdk";
import { Context, Hono } from "hono";
import { JWTPayload } from "jose";


const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

interface CustomContext extends Context {
  get(key: "session"): JWTPayload;
}

const app = new Hono()
  .get(
    "/token",
    async (c: CustomContext) => {
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

      if (!apiKey || !apiSecret) {
        console.log("No API key or secret");
        return c.json(
          {
            success: false,
            message: "Internal server error",
          },
          500
        );
      }

      const client = new StreamClient(apiKey, apiSecret);
      const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
      const issued = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

      const token = client.generateUserToken({
        user_id: id as string,
        exp,
        iat: issued,
      });

      return c.json({
        success: true,
        data: token,
      });
    }
  )
  ;

export default app;