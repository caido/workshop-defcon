import type { Caido } from "@caido/sdk-frontend";
import type { API } from "reflector-backend";

import type { PluginStorage } from "./types";

import "./styles/style.css";

type CaidoSDK = Caido<API>;

const Page = "/reflector" as const;
const Commands = {
  analyse: "reflector.analyse",
} as const;

const getCount = (sdk: CaidoSDK) => {
  const storage = {}; // CODE

  if (storage) {
    // @ts-ignore
    return storage.count;
  }

  return 0;
};

const increment = async (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  // CODE
};

const analyse = async (sdk: CaidoSDK) => {
  // CODE
  await increment(sdk);
};

const addPage = (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  const body = document.createElement("div");
  body.className = "reflector";
  body.innerHTML = `
    <div class="reflector__count">
      <span>Called:</span>
      <span class="reflector__value">${count}</span>
    </div>
    <div class="reflector__error">
      <span>Error:</span>
      <span class="reflector__error"></span>
    </div>
    <div>
      <button class="c-button" data-command="${Commands.analyse}">Analyse</button>
    </div>
  `;

  const countElement = body.querySelector(".reflector__value") as HTMLElement;
  const errorElement = body.querySelector(".reflector__error") as HTMLElement;
  const analyseButton = body.querySelector(
    `[data-command="${Commands.analyse}"]`,
  ) as HTMLButtonElement;

  // CODE

  analyseButton.addEventListener("click", async () => {
    analyseButton.disabled = true;
    try {
      await analyse(sdk);
    } catch (err: any) {
      errorElement.innerHTML = err.toString();
    } finally {
      analyseButton.disabled = false;
    }
  });

  // CODE
};

export const init = (sdk: CaidoSDK) => {
  // Commands
  // CODE

  // Register command palette
  // CODE

  // Register shortcut
  // CODE

  // Register page
  addPage(sdk);

  // Register sidebar
  // CODE
};
