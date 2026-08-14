const DEFAULT_TTL = 30000;
const cache = new Map();

exports.get = (key) => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expires < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
};

exports.set = (key, value, ttlMs = DEFAULT_TTL) => {
  cache.set(key, { value, expires: Date.now() + ttlMs });
};

exports.del = (prefix) => {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of [...cache.keys()]) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};
