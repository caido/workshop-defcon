import type { SDK } from "caido:plugin";

import type { Finding } from "./analyse";

export async function createFinding(sdk: SDK, finding: Finding) {
  let description = "Found reflected parameters in reponse:\n";
  for (let [key, value] of finding.parameters) {
    description += `- ${key}: ${value}\n`;
  }

  const result = await sdk.findings.create({
    dedupeKey: finding.dedupeKey,
    description,
    reporter: "Reflector Plugin",
    request: finding.request,
    title: "Reflected parameters",
  });

  sdk.console.log(`Finding created with ID ${result.getId()}`);
}
