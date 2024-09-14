import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.auth["google-login"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.auth["google-login"]["$post"]>["json"];

export const useGoogleLogin = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth["google-login"]["$post"]({
        json
      });
      console.log("google-login response", response);
      if (!response.ok) {
        throw new Error(
          response.statusText ?? "Something went wrong"
        )
      }
      return await response.json();
    },
  });
}