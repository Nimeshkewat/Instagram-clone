import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const rootDirectory = path.resolve(serverDirectory, "..");
const tscPath = path.join(
  rootDirectory,
  "node_modules",
  "typescript",
  "bin",
  "tsc",
);

const runTypeScript = (args) => {
  const result = spawnSync(process.execPath, [tscPath, ...args], {
    cwd: rootDirectory,
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

runTypeScript(["--project", "server/tsconfig.json"]);
runTypeScript([
  "--project",
  "shared/tsconfig.json",
  "--noEmit",
  "false",
  "--declaration",
  "false",
  "--declarationMap",
  "false",
  "--rootDir",
  "shared/src",
  "--outDir",
  "server/dist/.shared-package/dist",
]);

const sharedManifest = JSON.parse(
  await readFile(path.join(rootDirectory, "shared/package.json"), "utf8"),
);
const packagedSharedDirectory = path.join(
  serverDirectory,
  "dist/.shared-package",
);
await mkdir(packagedSharedDirectory, { recursive: true });
await writeFile(
  path.join(packagedSharedDirectory, "package.json"),
  `${JSON.stringify(
    { ...sharedManifest, exports: { ".": "./dist/index.js" } },
    null,
    2,
  )}\n`,
);

const installedSharedDirectory = path.join(
  serverDirectory,
  "dist/node_modules/@instagram-clone/shared",
);
await rm(installedSharedDirectory, { recursive: true, force: true });
await mkdir(path.dirname(installedSharedDirectory), { recursive: true });
await cp(packagedSharedDirectory, installedSharedDirectory, {
  recursive: true,
});
await rm(packagedSharedDirectory, { recursive: true, force: true });
