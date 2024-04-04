const { createClient } = require("redis");

const setCache = async (key, value, options) => {
  const client = createClient();
  await client.connect();

  return client.set(key, value, options);
};

const getCache = async (key) => {
  const client = createClient();
  await client.connect();

  return client.get(key);
};

const deleteCache = async (key) => {
  const client = createClient();
  await client.connect();

  return client.del(key);
};

module.exports = { setCache, getCache, deleteCache };
