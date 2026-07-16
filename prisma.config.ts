import { config } from "dotenv";
import { defineConfig, env } from "@prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"), // Use DIRECT_URL for migrations and schema pushes
  },
});
