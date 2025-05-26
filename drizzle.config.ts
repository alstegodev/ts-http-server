import {defineConfig} from "drizzle-kit";

export default defineConfig({
    schema: "src/db/schema.ts",
    out: "src/db/schema-generated.ts",
    dialect: "postgresql",
})