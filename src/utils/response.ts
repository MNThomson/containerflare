const errorNoDataJSON = {
  errors: [
    {
      code: "404",
      message: "No Data",
      detail: "No Data",
    },
  ],
};

function errorNoData(): Response {
  return new Response(JSON.stringify(errorNoDataJSON), {
    status: 404,
  });
}

export { errorNoData };
