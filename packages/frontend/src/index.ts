import type { Caido } from "@caido/sdk-frontend";
import type { API } from "reflector-backend";

import type { PluginStorage } from "./types";

import "./styles/style.css";

type CaidoSDK = Caido<API>;

const Page = "/reflector" as const;
const Commands = {
  analyse: "reflector.analyse",
} as const;

const getCount = (sdk: CaidoSDK) => {};

const increment = async (sdk: CaidoSDK) => {};

const analyse = async (sdk: CaidoSDK) => {};

const addPage = (sdk: CaidoSDK) => {};

export const init = (sdk: CaidoSDK) => {};
