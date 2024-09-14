import { auth } from "@/lib/firebase";
import { zValidator } from "@hono/zod-validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .post(
    "/email-login",
    zValidator("json", z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })),
    async (c) => {
      const { email, password } = c.req.valid("json");
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return c.json({
          success: true,
          message: "Login successfully",
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            phoneNumber: userCredential.user.phoneNumber,
            isEmailVerified: userCredential.user.emailVerified,
            createdAt: userCredential.user.metadata.creationTime,
            lastLoginAt: userCredential.user.metadata.lastSignInTime,
          },
        });
      } catch (error) {
        return c.json({
          success: false,
          message: "Email or password is incorrect",
        }, 401);
      }
    }
  );


export default app;