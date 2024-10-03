import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["email-signup"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["email-signup"]["$post"]
>["json"];

export const useEmailSignup = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth["email-signup"]["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error(response.statusText ?? "Something went wrong");
      }
      return await response.json();
    },
  });
};
