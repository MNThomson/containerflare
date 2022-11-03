export type MoreRequestData = {
  path: string;
  image: string;
  type: string;
  tag: string;
};

const pathPattern = new RegExp(/^http[s]?:\/\/?[^\/\s]+(.*)/);

// Regex from https://github.com/opencontainers/distribution-spec/blob/main/spec.md#pulling-manifests
const imageRegex =
  "[a-z0-9]+(?:[._-][a-z0-9]+)*(?:/[a-z0-9]+(?:[._-][a-z0-9]+)*)*";
const typeRegex = "manifests|blobs";
const pathRegex = "(?:sha256:)?(?:[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127})";
const imageTypeTagPattern = new RegExp(
  `^\/v2\/+(${imageRegex})\/(${typeRegex})\/?(${pathRegex})`
);

function parseRequest(link: string): MoreRequestData {
  const path = pathPattern.exec(link)![1];

  try {
    const image = imageTypeTagPattern.exec(path)![1];
    const type = imageTypeTagPattern.exec(path)![2];
    const tag = imageTypeTagPattern.exec(path)![3];

    return {
      path,
      image,
      type,
      tag,
    };
  } catch (error) {
    return {
      path,
      image: "",
      type: "",
      tag: "",
    };
  }
}

export default parseRequest;
