import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<typeof client.api.profiles.me["$get"], 200>;

export const useProfile = () => {
  const query = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await client.api.profiles.me["$get"]();
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
