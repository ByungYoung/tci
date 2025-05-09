import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 간소화된 ESLint 설정
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      ".next/",
      "out/",
      "node_modules/",
      "public/locales/",
      "next-env.d.ts",
      "src/lib/db/migrate.js",
    ],
  },
];

export default eslintConfig;
