export const generateFields = (properties, disableChoices = false) => {
  if (!Array.isArray(properties)) {
    throw new Error("Invalid properties: must be an array.");
  }

  return properties.map((field) => {
    if (!field || !field.component || !field.value) {
      console.warn("Invalid field definition:", field);
      return null;
    }

    // Handle NestedObjectSection
    if (field.component === "NestedObjectSection") {
      if (!Array.isArray(field.properties)) {
        console.warn("Invalid NestedObjectSection properties:", field);
        return null;
      }
      const nestedFields = field.properties
        .map(
          (nestedField) =>
            nestedField.component && nestedField.value
              ? `<${nestedField.component} source="${nestedField.value}" />`
              : null
        )
        .filter(Boolean)
        .join("\n");
      return `<> 
        <h3>${field.name || "Section"}</h3>
        ${nestedFields}
      </>`;
    }

    // Handle ArrayObjectSimpleFormIterator
    if (field.component === "ArrayObjectSimpleFormIterator") {
      if (!Array.isArray(field.items)) {
        console.warn("Invalid items for ArrayObjectSimpleFormIterator:", field);
        return null;
      }
      return `<> 
        <ArrayInput source="${field.value}">
          <SimpleFormIterator>
            ${generateFields(field.items, disableChoices).join("\n")}
          </SimpleFormIterator>
        </ArrayInput>
      </>`;
    }

    // Handle ReferenceField for listView
    if (field.component === "ReferenceField") {
      return `<ReferenceField source="${
        field.value
      }" reference="${field.value.replace(/Id$/, "s")}">
        <TextField source="name" />
      </ReferenceField>`;
    }

    // Handle ReferenceInput for createView
    if (field.component === "ReferenceInput") {
      return `<ReferenceInput source="${
        field.value
      }" reference="${field.value.replace(/Id$/, "s")}">
          <AutocompleteInput optionText="name" />
      </ReferenceInput>`;
    }

    // Handle CheckboxGroupInput for createView
    if (field.component === "CheckboxGroupInput") {
      if (!disableChoices && !Array.isArray(field.choices)) {
        console.warn("Invalid choices for CheckboxGroupInput:", field);
        return null;
      }
      return `<CheckboxGroupInput source="${field.value}"${
        !disableChoices ? ` choices={${JSON.stringify(field.choices)}}` : ""
      } />`;
    }

    // Handle CheckboxGroupField for listView
    if (field.component === "CheckboxGroupField") {
      return `<ChipField source="${field.value}" />`;
    }

    // Handle other components
    return `<${field.component} source="${field.value}"${
      field.choices && !disableChoices
        ? ` choices={${JSON.stringify(field.choices)}}`
        : ""
    } />`;
  }).filter(Boolean); // Remove null/invalid fields from the result
};