import jscodeshift from "jscodeshift";
import * as reactAdminExports from "react-admin";

export function fixImports(fileContent) {
  const transformer = (file, api) => {
    const j = api.jscodeshift;

    // Use the 'tsx' parser to handle TypeScript syntax
    const root = j.withParser("tsx")(file.source);

    const jsxElements = new Set();

    // Collect all JSX elements used in the file
    root.find(j.JSXElement).forEach((path) => {
      const tagName = path.node.openingElement.name;
      if (tagName.type === "JSXIdentifier") {
        jsxElements.add(tagName.name);
      }
    });

    const reactAdminComponents = new Set(Object.keys(reactAdminExports));
    const validElements = [...jsxElements].filter((element) =>
      reactAdminComponents.has(element)
    );

    if (validElements.length === 0) {
      return file.source; // No valid elements, return the original file
    }

    let reactAdminImportPath = null;

    // Find existing react-admin import
    root.find(j.ImportDeclaration).forEach((path) => {
      if (path.node.source.value === "react-admin") {
        reactAdminImportPath = path;
      }
    });

    if (reactAdminImportPath) {
      // Update the existing react-admin import
      const existingSpecifiers = new Set(
        reactAdminImportPath.node.specifiers.map(
          (specifier) => specifier.local.name
        )
      );

      const newSpecifiers = validElements.filter(
        (element) => !existingSpecifiers.has(element)
      );

      // Add only the new specifiers to the existing import
      newSpecifiers.forEach((name) => {
        reactAdminImportPath.node.specifiers.push(
          j.importSpecifier(j.identifier(name))
        );
      });
    } else {
      // Create a new import if react-admin import does not exist
      const newImport = j.importDeclaration(
        validElements.map((name) => j.importSpecifier(j.identifier(name))),
        j.literal("react-admin")
      );

      // Add the new import declaration at the top of the file
      root.get().node.program.body.unshift(newImport);
    }

    return root.toSource();
  };

  const file = { source: fileContent };
  const api = { jscodeshift };

  return transformer(file, api);
}