#!/usr/bin/env node
import inquirer from "inquirer";
import { generate } from "./commands/generate.js";

const main = async () => {
  try {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "Add new resources",
          "Exit",
        ],
      },
    ]);

    switch (action) {
      case "Add new resources":
        generate();
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit(0);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();