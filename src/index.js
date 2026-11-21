export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      url.pathname = "/Index.HTML";
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
