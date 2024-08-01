import type { Request, Response } from "caido:utils";

import { notNullable } from "./utils";

export type Finding = {
  request: Request;
  parameters: [string, string][];
  dedupeKey: string;
};

export function analyse(request: Request, response: Response): Finding | null {
  return null;
}
