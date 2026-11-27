// TDD-lite checks for the best-meal entry (kit: program/v1, gate = entry.txt
// must be UTF-8 text of 1 to 200 characters, not only white space).
// Run: node check.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
}

function runOnce() {
  const out = mkdtempSync(join(tmpdir(), "best-meal-out-"));
  try {
    execFileSync(process.execPath, [join(repoDir, "main.ts")], {
      env: { ...process.env, MAKEFUN_OUTPUT_DIR: out },
      stdio: "pipe",
    });
    return readFileSync(join(out, "entry.txt"), "utf8");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const text = runOnce();

// 1. Gate: 1..200 characters, not only whitespace.
check("length 1..200 chars", text.length >= 1 && text.length <= 200, `${text.length} chars`);
check("not only whitespace", text.trim().length > 0);

// 2. One sentence: exactly one terminal period, no newline, no list.
check("single sentence", (text.match(/\./g) || []).length === 1 && !text.includes("\n"));

// 3. Determinism: two runs produce identical bytes.
check("deterministic", runOnce() === text);

// 4. Concrete detail present: a named dish + a place + a sensory detail.
check("named dish present", /nasi goreng/i.test(text));
check("place present", /Jakarta/i.test(text));
check("sensory detail present", /(crackling|steam|yolk|gold)/i.test(text));

// 5. No meta words about the bounty/workflow.
check("no meta words", !/(make\.fun|bounty|entry|grading|judge)/i.test(text));

console.log(failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
