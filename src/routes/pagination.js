const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Returns the parsed value, the fallback when the param is absent, or null when invalid.
function parsePositiveInt(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
}

// Parses page/limit query params. Returns { page, limit, offset } or { error }.
function parsePagination(query) {
  const page = parsePositiveInt(query.page, 1);
  const limit = parsePositiveInt(query.limit, DEFAULT_LIMIT);

  if (page === null) return { error: 'page must be a positive integer' };
  if (limit === null || limit > MAX_LIMIT) {
    return { error: `limit must be an integer between 1 and ${MAX_LIMIT}` };
  }
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset)) return { error: 'page is too large' };
  return { page, limit, offset };
}

module.exports = { parsePagination };
