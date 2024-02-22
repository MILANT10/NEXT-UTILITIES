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

const blueColor = "\x1b[34m";
const resetColor = "\x1b[0m";

let componentName = process.argv[2];
let componentWithStyles = process.argv[3];
let extension = process.argv[4];

if (!componentName) {
  rl.question(
    `${blueColor}\nPlease provide a component name: ${resetColor}`,
    (answer) => {
      componentName = answer.trim();
      askForStyles();
    }
  );
} else {
  askForStyles();
}

function askForStyles() {
  if (!componentWithStyles) {
    rl.question(
      `${blueColor}\nDo you want to create a component with styles? (y/n): ${resetColor}`,
      (answer) => {
        componentWithStyles = answer.trim();
        askForExtension();
      }
    );
  } else {
    askForExtension();
  }
}

function askForExtension() {
  if (!extension) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "extension",
          message: "Choose the extension of the component file",
          choices: ["jsx", "tsx"],
        },
      ])
      .then((answers) => {
        extension = answers.extension;
        createComponent(componentName, componentWithStyles, extension);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    createComponent(componentName, componentWithStyles, extension);
  }
}

function createComponent(componentName, componentWithStyles, extension) {
  const componentsDir = path.join(cwd, "src", "components");
  const componentDir = path.join(componentsDir, componentName);
  const componentFile = path.join(
    componentDir,
    `${componentName}.${extension}`
  );

  fs.mkdirSync(componentDir, { recursive: true });

  let componentContent = "";

  if (extension === "jsx") {
    componentContent = `
export function ${componentName}(){
  return (
    <div${
      componentWithStyles === "y"
        ? " className={styles." + componentName + "}"
        : ""
    }>
      {/* your code here */}
    </div>
  );
}`;
  } else if (extension === "tsx") {
    componentContent = `
import React from 'react';
import styles from './style.module.css'; // Importation du module de style

interface Props {
  // Définir les types des props si nécessaire
}

const ${componentName}: React.FC<Props> = () => {
  return (
    <div className={styles.container}>
      {/* your code here */}
    </div>
  );
};

export default ${componentName};`;
  }

  fs.writeFileSync(componentFile, componentContent);

  if (componentWithStyles === "y") {
    const styleFile = path.join(componentDir, `style.module.css`);

    fs.writeFileSync(
      styleFile,
      `.${componentName} {
  /* styles for ${componentName} component */
}`
    );
  }

  console.log(
    `Component ${componentName} created successfully at ${componentFile}`
  );
  rl.close();
}
