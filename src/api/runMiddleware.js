// Simple Next.js API middleware runner
export default function runMiddleware(req, res, middlewares) {
  return middlewares.reduce(
    (prev, fn) => prev.then(() => new Promise((resolve) => fn(req, res, resolve))),
    Promise.resolve()
  );
}
