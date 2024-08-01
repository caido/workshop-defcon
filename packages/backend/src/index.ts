import type { Request, Response } from "caido:utils";
import type { SDK, DefineAPI } from "caido:plugin";
import { FileHandle, open } from "fs/promises";
import { Mutex } from "async-mutex";

import { analyse } from "./analyze";
import { createFinding } from "./finding";

let FILE: FileHandle | null = null;
const FILE_MUTEX = new Mutex();

function process_existing(sdk: SDK): void {
  sdk.console.log("Analyzing existing requests");
}

async function process_new(
  sdk: SDK,
  request: Request,
  response: Response,
): Promise<void> {
  sdk.console.log(`New request ${request.getId()}`);

  const finding = analyse(request, response);
  if (finding) {
    sdk.console.log(
      `Found reflected parameter(s) ${finding.parameters} in request {finding.id}`,
    );
    await createFinding(sdk, finding);
    await FILE_MUTEX.runExclusive(async () => {
      await FILE?.write(
        `${request.getMethod()} ${request.getHost()}:${request.getPort()}${request.getPath()}?${request.getQuery()}\n`,
      );
    });
  }
}

export type API = DefineAPI<{
  processExisting: typeof process_existing;
}>;

export async function init(sdk: SDK) {
  FILE = await open("output.txt", "a");

  sdk.api.register("processExisting", process_existing);

  sdk.events.onInterceptResponse(process_new);
}
