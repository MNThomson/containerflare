// Regex from https://github.com/opencontainers/distribution-spec/blob/main/spec.md#pulling-manifests
const nameRegex = new RegExp(
  "^[a-z0-9]+([._-][a-z0-9]+)*(/[a-z0-9]+([._-][a-z0-9]+)*)*$"
);
const referenceRegex = new RegExp(
  "^(sha256:)?([a-zA-Z0-9_][a-zA-Z0-9._-]{0,127})$"
);

function parseParams(params: Record<string, string | string[]>): {
  name: string;
  reference: string;
  error: string;
} {
  try {
    const name = (params.name as string[]).join("/");
    const reference = params.reference as string;

    let error = "";
    if (!nameRegex.test(name)) {
      error += "Name incorrect ";
    }
    if (!referenceRegex.test(reference)) {
      error += "Reference incorrect";
    }

    return {
      name: name,
      reference: reference,
      error,
    };
  } catch (error) {
    console.log(error);
    return {
      name: "",
      reference: "",
      error: "Params are invalid",
    };
  }
}

export { parseParams };
