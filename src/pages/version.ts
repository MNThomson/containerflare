export const prerender = true;

export const GET: APIRoute = async () => {
  // return new Response(import.meta.env.PUBLIC_GIT_SHA);
  return new Response("todo!()");
}
