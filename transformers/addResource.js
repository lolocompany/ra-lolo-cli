import fs from "fs";
import Handlebars from "handlebars";
import jscodeshift from "jscodeshift";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function addResource(filePath, resourceName) {
  const importPath = `@resources`;
  const source = fs.readFileSync(filePath, "utf-8");
  const j = jscodeshift.withParser("tsx");
  const root = j(source);

  const importExists = root
    .find(j.ImportDeclaration, {
      source: { value: importPath },
    })
    .size();

  if (!importExists) {
    const importDeclaration = j.importDeclaration(
      [j.importSpecifier(j.identifier(`${resourceName}Resource`))],
      j.literal(importPath)
    );

    root.find(j.ImportDeclaration).at(0).insertBefore(importDeclaration);
  } else {
    root
      .find(j.ImportDeclaration, {
        source: { value: importPath },
      })
      .forEach((path) => {
        const hasResource = path.value.specifiers.some(
          (spec) => spec.local && spec.local.name === `${resourceName}Resource`
        );

        if (!hasResource) {
          const specifier = j.importSpecifier(
            j.identifier(`${resourceName}Resource`)
          );
          path.value.specifiers.push(specifier);
        }
      });
  }
  const resourceExists = root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: "Resource" },
        attributes: [
          {
            type: "JSXSpreadAttribute",
            argument: {
              type: "Identifier",
              name: `${resourceName}Resource`,
            },
          },
        ],
      },
    })
    .size();

  if (!resourceExists) {
    const adminNode = root.find(j.JSXElement, {
      openingElement: { name: { name: "Admin" } },
    });

    if (adminNode.size() > 0) {
      const templatePath = path.resolve(
        __dirname,
        "../templates/resourceComponent.jsx.hbs"
      );
      const templateContent = fs.readFileSync(templatePath, "utf-8");
      Handlebars.registerHelper("openBrace", function () {
        return "{";
      });
      Handlebars.registerHelper("closeBrace", function () {
        return "}";
      });
      const resourceTemplate = Handlebars.compile(templateContent);

      const resourceCode = resourceTemplate({
        resourceName: resourceName,
      });

      const resourceElement = j(resourceCode).nodes();

      const lastResource = root.find(j.JSXElement, {
        openingElement: { name: { name: "Resource" } },
      });

      adminNode.forEach((path) => {
        if (lastResource.size() > 0) {
          lastResource.at(-1).insertAfter(resourceElement);
        } else {
          const children = path.value.children || [];
          children.push(...resourceElement);
          path.value.children = children;
        }
      });
    }
  }

  const newCode = root.toSource();
  fs.writeFileSync(filePath, newCode, "utf-8");
}
