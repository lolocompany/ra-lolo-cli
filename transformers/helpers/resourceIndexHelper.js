import fs from "fs";
import path from "path";

export function updateResourceIndex(resource) {
  const projectRoot = process.env.PROJECT_PATH || './';
  const indexPath = path.join(projectRoot, "src", "resources", "index.ts");
  const resourcesDir = path.join(projectRoot, "src", "resources");
  
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
  
  let content = "";
  if (fs.existsSync(indexPath)) {
    content = fs.readFileSync(indexPath, "utf-8");
  }

  const exportStatement = `export * from "./${resource.plural}";`;
  
  if (!content.includes(exportStatement)) {
    const newContent = content ? `${content}\n${exportStatement}` : exportStatement;
    fs.writeFileSync(indexPath, newContent, "utf-8");
  }
} 