import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

// Load .env.local if present locally; on Vercel env vars are injected directly into process.env
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || process.env.DIRECT_URL || "postgresql://postgres:postgres@localhost:5432/mydb",
  },
});
