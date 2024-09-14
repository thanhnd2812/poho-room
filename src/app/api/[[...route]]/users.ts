import { getUserByPhoneAndPassword } from "@/lib/dal/user";
import { auth } from "@/lib/firebase";
import { clearSession, setSession } from "@/lib/session";
import { zValidator } from "@hono/zod-validator";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
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

        const data = await getUserByPhoneAndPassword(
          phoneNumber,
          password
        );
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
        console.log("phone-login", error);
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
  .post(
    "/google-login",
    zValidator(
      "json",
      z.object({ tokenId: z.string().min(1).trim() })
    ),
    async (c) => {
      const { tokenId } = c.req.valid("json");
      try {
        // Create a credential from the Google ID token
        const credential = GoogleAuthProvider.credential(tokenId);

        // Sign in to Firebase with the credential
        const userCredential = await signInWithCredential(auth, credential);

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
        console.log("google-login", error);
        return c.json(
          {
            success: false,
            message: "Google login failed",
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
