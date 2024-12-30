import Handlebars from "handlebars";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("openBrace", () => "{");
  Handlebars.registerHelper("closeBrace", () => "}");
}
