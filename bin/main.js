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
let styleExtension = process.argv[4];
let extension = process.argv[5];

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
    inquirer
      .prompt([
        {
          type: "list",
          name: "styles",
          message: `${blueColor}Do you want to create a style file?\n`,
          choices: ["y", "n"],
        },
      ])
      .then((answers) => {
        componentWithStyles = answers.styles;
        if (componentWithStyles === "y") askForStyleExtension();
        else askForExtension();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    askForStyleExtension();
  }
}

function askForStyleExtension() {
  if (!styleExtension) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "extension",
          message: `${blueColor}Choose the extension of the style file\n`,
          choices: ["css", "scss"],
        },
      ])
      .then((answers) => {
        styleExtension = answers.extension;
        askForExtension();
      })
      .catch((error) => {
        console.log(error);
      });
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
          message: "Choose the extension of the component file\n",
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
  let styleImport = "";

  if (componentWithStyles === "y") {
    styleImport = `import styles from "./style.module.${styleExtension}";\n\n`;
  }

  if (extension === "jsx") {
    componentContent = `${styleImport}export function ${componentName}({props}){
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
    componentContent = `${styleImport}
    type Props = {
      // your props here
    }
    
    export function ${componentName}({}: Props){
  return (
    <div${
      componentWithStyles === "y"
        ? " className={styles." + componentName + "}"
        : ""
    }>
      {/* your code here */}
    </div>
  );
};`;
  }

  fs.writeFileSync(componentFile, componentContent);

  if (componentWithStyles === "y") {
    const styleFile = path.join(componentDir, `style.module.${styleExtension}`);

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
