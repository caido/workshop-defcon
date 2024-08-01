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
  const storage = sdk.storage.get() as PluginStorage | undefined;

  if (storage) {
    return storage.count;
  }

  return 0;
};

const increment = async (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  await sdk.storage.set({ count: count + 1 });
};

const analyse = async (sdk: CaidoSDK) => {
  await sdk.backend.processExisting();
  await increment(sdk);
};

const addPage = (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  const body = document.createElement("div");
  body.className = "my-plugin";
  body.innerHTML = `
    <div class="my-plugin__count">
      <span>Called:</span>
      <span class="my-plugin__value">${count}</span>
    </div>
    <div>
      <button class="c-button" data-command="${Commands.analyse}">Analyse</button>
    </div>
  `;

  const analyseButton = body.querySelector(
    `[data-command="${Commands.analyse}"]`,
  ) as HTMLButtonElement;

  analyseButton.addEventListener("click", async () => {
    analyseButton.disabled = true;
    try {
      await analyse(sdk);
    } finally {
      analyseButton.disabled = false;
    }
  });

  sdk.navigation.addPage(Page, {
    body,
  });
};

export const init = (sdk: CaidoSDK) => {
  // Commands
  sdk.commands.register(Commands.analyse, {
    name: "Analyse",
    run: () => analyse(sdk),
  });

  // Register command palette
  sdk.commandPalette.register(Commands.analyse);

  // Register shortcut
  sdk.shortcuts.register(Commands.analyse, []);

  // Register page
  addPage(sdk);

  // Register sidebar
  sdk.sidebar.registerItem("My plugin", Page, {
    icon: "fas fa-wand-magic-sparkles",
  });
};
