/**
 * Resolve Postman-style {{var}} placeholders using provided variables object.
 * - If input is not string, returns input unchanged.
 * - Unknown variables resolve to empty string.
 */
export function replaceEnvVars (input, variables = {}) {
    if (input === null || input === undefined) return input;
    if (typeof input !== "string") return input;
  
    return input.replace(/{{\s*([\w.\-]+)\s*}}/g, (_, key) => {
      // support nested keys like foo.bar? (we'll just match the literal name)
      return variables && variables.hasOwnProperty(key) ? variables[key] : "";
    });
  }
  