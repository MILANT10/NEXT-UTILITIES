#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { exec } from "child_process";

const cwd = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let projectName = process.argv[2];

if (!projectName) {
  rl.question("\nPlease provide a project name:", (answer) => {
    projectName = answer.trim();
    rl.close();
    createProject();
  });
} else {
  createProject();
}

function createProject() {
  const projectPath = path.join(cwd, projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`The project ${projectName} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);

  // Add any additional project setup code here

  console.log(`Project ${projectName} created successfully at ${projectPath}.`);

  // Execute a command after project creation
  const command = `cd ^${projectPath} && git clone https://github.com/MILANT10/NEXT-TEMPLATE . && pnpm i && git remote remove origin`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      fs.readFile(`${projectPath}/package.json`, function read(err, data) {
        if (err) {
          throw err;
        }
        const content = data.toString();
        const result = content.replace(
          /"name": "(.*)"/,
          `"name": "${projectName.toLowerCase().replace(/ /g, "-")}"`
        );
        fs.writeFile(
          `${projectPath}/package.json`,
          result,
          "utf8",
          function write(err) {
            if (err) {
              throw err;
            }
          }
        );
      });
      fs.readFile(`${projectPath}/package-lock.json`, function read(err, data) {
        if (err) {
          throw err;
        }
        const content = data.toString();
        const result = content.replace(
          /"name": "(.*)"/,
          `"name": "${projectName.toLowerCase().replace(/ /g, "-")}"`
        );
        fs.writeFile(
          `${projectPath}/package-lock.json`,
          result,
          "utf8",
          function write(err) {
            if (err) {
              throw err;
            }
          }
        );
      });

      return;
    }

    console.log(`Command stdout: ${stdout}`);
  });
}
