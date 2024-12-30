import Handlebars from "handlebars";
import { registerHandlebarsHelpers } from "./handlebarsHelper.js";

export function hasResourceComponent(j, root, resourceName) {
  return (
    root
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
      .size() > 0
  );
}

export function addResourceComponent(
  j,
  root,
  resourceName,
  templatePath,
  templateContent
) {
  const adminNode = root.find(j.JSXElement, {
    openingElement: { name: { name: "Admin" } },
  });

  if (adminNode.size() === 0) return;

  registerHandlebarsHelpers();

  const resourceTemplate = Handlebars.compile(templateContent);
  const resourceCode = resourceTemplate({ resourceName });
  const resourceElement = j(resourceCode).nodes();

  adminNode.forEach((path) => {
    const lastResource = root.find(j.JSXElement, {
      openingElement: { name: { name: "Resource" } },
    });

    if (lastResource.size() > 0) {
      lastResource.at(-1).insertAfter(resourceElement);
    } else {
      const children = path.value.children || [];
      children.push(...resourceElement);
      path.value.children = children;
    }
  });
}
