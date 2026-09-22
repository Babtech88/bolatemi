import { app } from "../src/app";

export default function handler(req: any, res: any) {
  const queryPath = req.query?.path;

  if (typeof queryPath === "string" && queryPath) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query ?? {})) {
      if (key === "path") continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, String(item));
        }
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const queryString = params.toString();

    req.url = `/api/${queryPath}${queryString ? `?${queryString}` : ""}`;
  }

  return app(req, res);
}
