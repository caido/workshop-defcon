import type { Request, Response } from "caido:utils";
import type { SDK, DefineAPI } from "caido:plugin";
import { FileHandle, open } from "fs/promises";
import { Mutex } from "async-mutex";

import { analyse } from "./analyse";
import { createFinding } from "./finding";

let FILE: FileHandle | null = null;
const FILE_MUTEX = new Mutex();

async function process_existing(sdk: SDK): Promise<void> {
  sdk.console.log("Analyzing existing requests");

  sdk.console.log("Finished analyzing existing requests");
}

async function process_new(
  sdk: SDK,
  request: Request,
  response: Response,
): Promise<void> {
  sdk.console.log(`New request ${request.getId()}`);
}

export type API = DefineAPI<{}>;

export async function init(sdk: SDK) {
  FILE = await open("output.txt", "a");
}
