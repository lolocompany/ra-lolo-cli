import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import path, { basename, join } from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { fixImports } from "../transformers/fixImport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateFiles(resource, components, projectPath) {
  const templateDir = path.resolve(__dirname, "../templates/resource");
  const outputDir = projectPath;
  const resourceDir = join(outputDir, resource.plural);

  try {
    if (!existsSync(resourceDir)) {
      mkdirSync(resourceDir, { recursive: true });
      console.log(`Created directory: ${resourceDir}`);
    }

    const templateFiles = readdirSync(templateDir);

    templateFiles.forEach((file) => {
      const templatePath = join(templateDir, file);
      const baseFileName = basename(file, ".hbs");
      const newFileName = baseFileName.includes("Resource")
        ? baseFileName.replace("Resource", resource.pascalCase)
        : baseFileName;
      const outputPath = join(resourceDir, newFileName);

      if (existsSync(outputPath)) {
        console.log(`File already exists: ${outputPath}, skipping...`);
        return;
      }

      const templateContent = readFileSync(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const inputData = {
        resourceName: resource.pascalCase,
        resourceNameCamelCase: resource.camelCase,
        components,
      };
      const outputContent = template(inputData);
      const importFixedContent = fixImports(outputContent);

      writeFileSync(outputPath, importFixedContent, "utf-8");
      console.log(`File generated: ${outputPath}`);
    });
  } catch (error) {
    console.error("Error generating files:", error);
  }
}
