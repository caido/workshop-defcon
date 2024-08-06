import type { Request, Response } from "caido:utils";

import { notNullable } from "./utils";

export type Finding = {
  request: Request;
  parameters: [string, string][];
  dedupeKey: string;
};

export function analyse(request: Request, response: Response): Finding | null {
  const query = "query"; // CODE
  if (!query) {
    return null;
  }

  const parameters = Object.fromEntries(
    query
      .split("&")
      .map<[string, string] | null>((part) => {
        const i = part.indexOf("=");
        if (i === -1) {
          return null;
        }
        const key = part.slice(0, i);
        const value = part.slice(i + 1);
        return value ? [key, value] : null;
      })
      .filter(notNullable),
  );

  const responseRaw = ""; // CODE

  const reflectedParameters: [string, string][] = [];
  for (const [key, value] of Object.entries(parameters)) {
    if (responseRaw.includes(value)) {
      reflectedParameters.push([key, value]);
    }
  }

  if (reflectedParameters.length > 0) {
    const dedupeKey = ""; // CODE
    return {
      request,
      parameters: reflectedParameters,
      dedupeKey,
    };
  }
  return null;
}
