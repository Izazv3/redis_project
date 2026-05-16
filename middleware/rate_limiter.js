const client = require("../redis_client");

const ratelimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const request = await client.get(ip);

    if (request && Number(request) >= 5) {
      return res.status(429).json({
        message: "Too many requests. try again later.",
      });
    }

    if (request) {
      await client.incr(ip);
    } else {
      await client.setEx(ip, 60, "1");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = ratelimiter;
