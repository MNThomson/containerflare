export const prerender = true;

export async function get() {
  return {
    body: import.meta.env.PUBLIC_GIT_SHA,
  };
}
