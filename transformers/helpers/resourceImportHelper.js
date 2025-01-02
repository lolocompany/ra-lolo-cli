export function handleResourceImport(j, root, resourceName, importPath) {
  const importSpecifier = `${resourceName}Resource`;
  const existingImport = root.find(j.ImportDeclaration, {
    source: { value: importPath },
  });

  if (existingImport.size() === 0) {
    const importDeclaration = j.importDeclaration(
      [j.importSpecifier(j.identifier(importSpecifier))],
      j.literal(importPath)
    );
    root.find(j.ImportDeclaration).at(0).insertBefore(importDeclaration);
    return;
  }

  existingImport.forEach((path) => {
    const hasResource = path.value.specifiers.some(
      (spec) => spec.local && spec.local.name === importSpecifier
    );

    if (!hasResource) {
      path.value.specifiers.push(
        j.importSpecifier(j.identifier(importSpecifier))
      );
    }
  });
}
