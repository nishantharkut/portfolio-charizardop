// Simple in-memory rate limiter for API routes
// For production, use Redis or a proper store
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRequestLog = new Map();

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
}

module.exports = function rateLimit(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  let log = ipRequestLog.get(ip) || [];
  log = log.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (log.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  log.push(now);
  ipRequestLog.set(ip, log);
  next();
};
