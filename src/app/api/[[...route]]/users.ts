import { getUserByPhoneAndPassword } from "@/lib/dal/user";
import { auth } from "@/lib/firebase";
import { clearSession, setSession } from "@/lib/session";
import { encryptPassword } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Context, Hono } from "hono";
import { JWTPayload } from "jose";
import { z } from "zod";

interface CustomContext extends Context {
  get(key: "session"): JWTPayload;
}

const app = new Hono()
  .post(
    "/email-login",
    zValidator(
      "json",
      z.object({
        email: z.string().email().trim(),
        password: z.string().min(8).trim(),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = {
          id: userCredential.user.uid,
        };
        await setSession(user);
        return c.json({
          success: true,
          message: "Login successfully",
          user,
        });
      } catch (error) {
        console.log("email-login", error);
        return c.json(
          {
            success: false,
            message: "Email or password is incorrect",
          },
          401
        );
      }
    }
  )
  .post(
    "/phone-login",
    zValidator(
      "json",
      z.object({
        phoneNumber: z.string().min(10).trim(),
        password: z.string().min(8).trim(),
      })
    ),
    async (c) => {
      const { phoneNumber, password } = c.req.valid("json");
      try {
        const hashedPassword = await encryptPassword(password);
        const data = await getUserByPhoneAndPassword(
          phoneNumber,
          hashedPassword
        );
        console.log("data", data);
        if (!data) {
          return c.json(
            {
              success: false,
              message: "Phone number or password is incorrect",
            },
            401
          );
        }
        const user = {
          id: data.id,
        };
        await setSession(user);
        return c.json({
          success: true,
          message: "Login successfully",
          user,
        });
      } catch (error) {
        console.log(error);
        return c.json(
          {
            success: false,
            message: "Phone number or password is incorrect",
          },
          401
        );
      }
    }
  )
  .post("/logout", async (c: CustomContext) => {
    const session = c.get("session");
    console.log("session", session);
    await clearSession();
    return c.json({
      success: true,
      message: "Logout successfully",
    });
  });

export default app;
