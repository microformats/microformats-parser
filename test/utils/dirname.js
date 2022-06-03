import { fileURLToPath } from "url";
import path from "path";

export function dirname(url) {
  const __filename = fileURLToPath(url);
  return path.dirname(__filename);
}
