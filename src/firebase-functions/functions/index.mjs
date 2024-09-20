import cors from "cors";
import admin from "firebase-admin";
import { https, logger } from "firebase-functions";
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };
const corsHandler = cors({ origin: true });

async function createAdminApp() {
  // INITIALIZE PRODUCT MODE FIREBASE
  // const serviceAccount = require('./poho_service_account.json');
  // return admin.initializeApp({
  //   serviceAccountId: 'firebase-adminsdk-dqksa@poho-bed42.iam.gserviceaccount.com',
  //   storageBucket: 'gs://poho-bed42.appspot.com/',
  //   credential: admin.credential.cert(serviceAccount)
  // })


  /// INITIALIZE DEV MODE FIREBASE
  

  return admin.initializeApp({
    serviceAccountId: "firebase-adminsdk-xlxxa@poho-vn.iam.gserviceaccount.com",
    storageBucket: "gs://poho-vn.appspot.com/",
    credential: admin.credential.cert(serviceAccount),
  });
}

await createAdminApp();


export const getTranscriptionUrl = https.onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    try {
      const { roomId } = request.body.data;
      const fileName = `transcriptions/${roomId}.json`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);

      // Create an empty JSON file
      await file.save("{}", {
        metadata: { contentType: "application/json" },
      });

      // Generate a signed URL that's valid for 1 hour
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 3600 * 1000, // 1 hour
      });
      logger.info(`Generated URL: ${url}`);
      response.json({ result: { url } });
    } catch (error) {
      console.error("Error:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  });
});