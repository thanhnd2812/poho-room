import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.auth["logout"]["$post"]>;
type ResponseType = InferResponseType<typeof client.api.auth["logout"]["$post"]>;
export const useLogout = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.auth["logout"]["$post"]();
      if (!response.ok) {
        throw new Error(response.statusText ?? "Something went wrong");
      }
      return await response.json();
    },
  });
};