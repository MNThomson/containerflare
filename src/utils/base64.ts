function b64encode(str: string) {
  return btoa(str);
}

function b64decode(str: string) {
  return atob(str);
}

export { b64encode, b64decode };
