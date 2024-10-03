import { getUserByPhoneAndPassword } from "@/lib/dal/user";
import { auth, db } from "@/lib/firebase";
import { clearSession, setSession } from "@/lib/session";
import { encryptPassword, generateAffiliateId } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { applyActionCode, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Context, Hono } from "hono";
import { JWTPayload } from "jose";
import { z } from "zod";

interface CustomContext extends Context {
  get(key: "session"): JWTPayload;
}

const app = new Hono()
  .post("/email-signup", zValidator("json", z.object({
    fullname: z.string().min(1).max(50).trim(),
    email: z.string().email().trim(),
    password: z.string().min(8).trim(),
  })), async (c) => {
    const { fullname, email, password } = c.req.valid("json");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user, {
        url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      });
      const hashedPassword = await encryptPassword(password);

      const user = {
        id: userCredential.user.uid,
        password: hashedPassword,
        fullname,
        email,
        signInMethod: "email",
        address: null,
        allow_show_email: true,
        allow_show_phone: true,
        allow_show_location: true,
        children: null,
        fcm_token: [],
        parentId: null,
        points: 30,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        affiliateId: `${generateAffiliateId()}`,
      };

      const userDoc = doc(db, "users", userCredential.user.uid);
      await setDoc(userDoc, user);

      return c.json({
        success: true,
        message: "Signup successfully",
        user: {
          id: userCredential.user.uid,
        },
      });
    } catch (error) {
      console.log("email-signup", error);
      return c.json(
        {
          success: false,
          message: "Signup failed",
        },
        401
      );
    }
  })
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
  })
  .post(
    "/forgot-password",
    zValidator(
      "json",
      z.object({
        email: z.string().email().trim(),
      })
    ),
    async (c) => {
      const { email } = c.req.valid("json");
      try {
      await sendPasswordResetEmail(auth, email);
      return c.json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      console.log("forgot-password", error);
      return c.json(
        {
          success: false,
          message: "Forgot password failed",
        },
        401
      );
    }
    })
  .post("/verify-email",
    zValidator(
      "json",
      z.object({
        code: z.string().min(6).trim(),
      })
    ),
    async (c) => {
    const { code } = c.req.valid("json");
    try {
      // const email = await verifyPasswordResetCode(auth, code);
      await applyActionCode(auth, code);
      return c.json({
        success: true,
        message: "Email verified",
      });
    } catch (error) {
      console.log("verify-email", error);
      return c.json(
          {
            success: false,
            message: "Verify email failed",
          },
          401
        );
      }
    }
);

export default app;
