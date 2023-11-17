// Regex from https://github.com/opencontainers/distribution-spec/blob/main/spec.md#pulling-manifests
const nameRegex = new RegExp(
  "^[a-z\\d]+([._-][a-z\\d]+)*(/[a-z\\d]+([._-][a-z\\d]+)*)*$"
);
const referenceRegex = new RegExp("^(sha256:)?(\\w[\\w.-]{0,127})$");

function parseParams(params: Record<string, string | undefined>): {
  name: string;
  reference: string;
  error: Response | null;
} {
  try {
    if (!params) throw new Error;
    const name = params.name
    const reference = params.reference as string;

    let error = "";
    if (!nameRegex.test(name)) {
      error += "Name incorrect ";
    }
    if (!referenceRegex.test(reference)) {
      error += "Reference incorrect";
    }

    return {
      name,
      reference,
      error:
        error.length == 0
          ? null
          : new Response(
              `{"errors": [{
                "code": "123",
                "message": "Bad Params",
                "detail": "${error}"
              }]}`,
              { status: 404 }
            ),
    };
  } catch (error) {
    console.log(error);
    return {
      name: "",
      reference: "",
      error: new Response(
        `{"errors": [{
          "code": "123",
          "message": "Bad Params",
          "detail": "Bad Params"
        }]}`,
        { status: 404 }
      ),
    };
  }
}

export { parseParams };
