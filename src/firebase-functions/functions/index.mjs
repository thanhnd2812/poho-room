import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { https, logger } from "firebase-functions";
initializeApp();

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getTranscriptionUrl = https.onCall(async (data) => {
  const { roomId } = data;
  const fileName = `transcriptions/${roomId}.json`;
  const bucket = getStorage().bucket();
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
  logger.info("Generated URL:", url);
  return { url };
});
