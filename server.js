const express = require("express");

const axois = require("axios");

const client = require("./redis_client");

const app = express();

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `[${req.method}] ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
});

app.get("/posts", async (req, res) => {
  try {
    const cacheData = await client.get("posts");

    if (cacheData) {
      return res.json({
        source: "cache",
        data: JSON.parse(cacheData),
      });
    }

    const response = await axois.get(
      "https://jsonplaceholder.typicode.com/posts",
    );

    await client.setEx("posts", 10, JSON.stringify(response.data));

    res.json({
      source: "api",
      data: response.data,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
