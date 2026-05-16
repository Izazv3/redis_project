const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

async function connectRedis() {
  try {
    await client.connect();
    console.log("<<<<<< Redis connected >>>>>>");
  } catch (err) {
    console.log("❌ Redis connection failed:", err.message);
  }
}

connectRedis();
module.exports = client;
