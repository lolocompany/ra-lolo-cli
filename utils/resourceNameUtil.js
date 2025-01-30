import { pascalCase, camelCase, kebabCase } from 'change-case';
import pluralize from 'pluralize';

export const createResourceNameObject = (resourceName) => {
  const camelCaseName = camelCase(resourceName);
  return {
    pascalCase: pascalCase(resourceName),
    camelCase: camelCaseName,
    plural: pluralize(camelCaseName),
    kebabCase: kebabCase(resourceName),
    raw: resourceName,
  };
}; 