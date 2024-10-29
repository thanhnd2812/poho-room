import { StreamClient } from "@stream-io/node-sdk";
import firebaseServiceAccount from "./firebase-service-account.json";
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

const serverClient = new StreamClient(apiKey, apiSecret, {
  timeout: 6000,
});
const EXTERNAL_STORAGE_NAME = "gcs-transcriptions-2";
async function configureTranscriptionStorage() {
  try {
    
    // Create external storage configuration
    await serverClient.createExternalStorage({
      bucket: "poho-vn",
      name: EXTERNAL_STORAGE_NAME,
      storage_type: "gcs",
      gcs_credentials: JSON.stringify(firebaseServiceAccount),
    });

    console.log("External storage created successfully");

    // Verify the storage configuration
    await serverClient.checkExternalStorage({
      name: EXTERNAL_STORAGE_NAME,
    });

    console.log("External storage verified successfully");

    // Update the default call type to use the new storage
    await serverClient.video.updateCallType({
      name: "default",
      external_storage: EXTERNAL_STORAGE_NAME,
    });

    console.log("Default call type updated successfully");
  } catch (error) {
    console.error("Error configuring transcription storage:", error);
  }
}

configureTranscriptionStorage();
