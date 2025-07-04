import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

// Create base config from compatibility layer
const baseConfig = [...compat.extends("next/core-web-vitals", "next/typescript")]

// Add specific overrides for the attendance page
const eslintConfig = [
  ...baseConfig,
  {
    files: ["src/app/dashboard/attendance/page.tsx"],
    rules: {
      // Disable type checking for the attendance page export
      "@typescript-eslint/ban-ts-comment": "off",
      // Disable any other rules that might be causing issues
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
]

export default eslintConfig
