export const EXCLUDE_FIELDS = {
  create: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id", "version"],
  list: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id", "version"],
  edit: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id", "version"],
  show: ["createdBy", "updatedBy", "version"],
  filter: [],
};
