import type { Request, Response } from "caido:utils";

import { notNullable } from "./utils";

export type Finding = {
  request: Request;
  parameters: [string, string][];
  dedupeKey: string;
};

export function analyse(request: Request, response: Response): Finding | null {
  const query = request.getQuery();
  if (!query) {
    return null;
  }

  const parameters = Object.fromEntries(
    query
      .split("&")
      .flatMap<[string, string] | null>((part) => {
        const [key, value] = part.split("=", 2);
        return value ? [key!, value] : null;
      })
      .filter(notNullable),
  );

  const responseRaw = response.getBody()?.toText() ?? "";

  const reflectedParameters: [string, string][] = [];
  for (const [key, value] of Object.entries(parameters)) {
    if (responseRaw.includes(value)) {
      reflectedParameters.push([key, value]);
    }
  }

  if (reflectedParameters.length > 0) {
    const dedupeKey = `${request.getMethod()}-${request.getHost()}-${request.getPath()}`;
    return {
      request,
      parameters: reflectedParameters,
      dedupeKey,
    };
  }
  return null;
}
