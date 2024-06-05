#!/usr/bin/env node

import { spawn } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let command = process.argv[2];
let mode = "";

if (!command) {
  rl.question(
    `\nPlease provide a command: (dev, build, start, lint) `,
    (answer) => {
      command = answer.trim();
      switch (command) {
        case "dev":
          mode = "dev";
          startProcess();
          break;
        case "build":
          mode = "build";
          startProcess();
          break;
        case "start":
          mode = "start";
          startProcess();
          break;
        case "lint":
          mode = "lint";
          startProcess();
          break;
        default:
          console.error(`Unknown command: ${command}`);
          process.exit(1);
      }
    }
  );
} else {
  startProcess();
}

function startProcess() {
  const child = spawn("npm", ["run", mode], {
    shell: true,
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(`error: ${error.message}`);
  });

  child.on("exit", (code, signal) => {
    if (code) {
      console.error(`Process exited with code: ${code}`);
    } else if (signal) {
      console.error(`Process exited with signal: ${signal}`);
    }
  });
}
