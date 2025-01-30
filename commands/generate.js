import { promptProjectPath, resourcePrompt } from "../prompts/index.js";
import { getSchema } from "../services/schemaService.js";
import {
  createViewComponents,
  saveGeneratedResource,
} from "../utils/saveUtil.js";
import { createResourceNameObject } from "../utils/resourceNameUtil.js";

export const generate = async () => {
  try {
    const resourcesRaw = await resourcePrompt();
    const resources = resourcesRaw.split(",").map((res) => createResourceNameObject(res.trim()));
    const projectPath = process.env.PROJECT_PATH || ".";

    for (const resource of resources) {
      const schema = await getSchema(resource.kebabCase);
      const views = createViewComponents(schema);

      saveGeneratedResource(resource, views, projectPath);

      console.log(`Resource '${resource.pascalCase}' successfully generated and added.`);
    }
  } catch (error) {
    console.error("Error during resource generation:", error);
  }
};
