#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import inquirer from "inquirer";

const cwd = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let pageName = process.argv[2];
let layout = process.argv[3];

if (!pageName) {
  rl.question("\nPlease provide a page name:", (answer) => {
    pageName = answer.trim();
    askForLayout();
  });
} else {
  askForLayout();
}

function askForLayout() {
  if (!layout) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "layout",
          message: "Do you want to create a layout file?",
          choices: ["y", "n"],
        },
      ])
      .then((answers) => {
        layout = answers.layout;
        if (layout === "y") createLayout();
        else createPage();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    createPage();
  }
}

function createLayout() {
  const layoutName = "layout.tsx";
  const layoutPath = path.join(cwd, "src", "app", pageName, layoutName);
  const layoutContent = `export default function ${pageName}Layout({ 
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
       {children}
      </>
    );
  }`;

  fs.mkdir(
    path.join(cwd, "src", "app", pageName),
    { recursive: true },
    (err) => {
      if (err) throw err;
      fs.writeFile(layoutPath, layoutContent, (err) => {
        if (err) throw err;
        console.log(`Layout file created at ${layoutPath}`);
        createPage(); // Call createPage after layout is created
      });
    }
  );
}

function createPage() {
  const pagePath = path.join(cwd, "src", "app", pageName, "page.tsx");
  const pageContent = `export default function ${pageName}() {
  return (
    <div>
      {/* content */}
    </div>
  );
}`;

  fs.mkdir(
    path.join(cwd, "src", "app", pageName),
    { recursive: true },
    (err) => {
      if (err) throw err;
      fs.writeFile(pagePath, pageContent, (err) => {
        if (err) throw err;
        console.log(`Page file created at ${pagePath}`);
      });
    }
  );

  console.log(`Page created successfully at src/app/${pageName}`);
  rl.close();
}
