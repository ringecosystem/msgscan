import { APP_BASE_API_URL } from "@/config/api";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(APP_BASE_API_URL);
