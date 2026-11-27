// The Best Meal You Ever Had — make.fun entry (program/v1, Node 22, stdlib only).
// Writes one sentence (at most 200 characters) about the best meal ever had
// to $MAKEFUN_OUTPUT_DIR/entry.txt. Deterministic: same output every run.
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "Barefoot on my grandmother's kitchen tiles in Jakarta, I ate nasi goreng still crackling from the wok, the yolk running gold, and I have been eating my way back to that kitchen ever since.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir; // resolved from the script location, not process.cwd()

writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
