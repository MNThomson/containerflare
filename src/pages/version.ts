export const prerender = true;

export function get(): Record<string, string> {
  return {
    body: import.meta.env.PUBLIC_GIT_SHA,
  };
}
