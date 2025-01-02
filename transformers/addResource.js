import fs from "fs";
import jscodeshift from "jscodeshift";
import path from "path";
import { fileURLToPath } from "url";
import {
  addResourceComponent,
  hasResourceComponent,
} from "./helpers/resourceComponentHelper.js";
import { handleResourceImport } from "./helpers/resourceImportHelper.js";
import { updateResourceIndex } from "./helpers/resourceIndexHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORT_PATH = "@resources";
const TEMPLATE_PATH = "../templates/resourceComponent.jsx.hbs";

export function addResource(filePath, resource) {
  const source = fs.readFileSync(filePath, "utf-8");
  const j = jscodeshift.withParser("tsx");
  const root = j(source);

  handleResourceImport(j, root, resource.camelCase, IMPORT_PATH);

  if (!hasResourceComponent(j, root, resource.pascalCase)) {
    const templateContent = fs.readFileSync(
      path.resolve(__dirname, TEMPLATE_PATH),
      "utf-8"
    );
    addResourceComponent(j, root, resource.camelCase, TEMPLATE_PATH, templateContent);
  }

  updateResourceIndex(resource);

  const newCode = root.toSource();
  fs.writeFileSync(filePath, newCode, "utf-8");
}
