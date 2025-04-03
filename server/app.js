require("dotenv").config();

const http = require("http");

const swaggerUi = require("swagger-ui-express");

const YAML = require("yamljs");

const express = require("express");

const client = require("prom-client");

const serverConfig = require("./src/config/serverConfig");

const indexRouter = require("./src/routes/index.routes");

const { upgradeCb, wss } = require("./src/ws/upgradeCB");

const connectionCb = require("./src/ws/connectionCB");

const formatResponse = require("./src/utils/formatResponse");

const app = express();

serverConfig(app);

const swaggerDocument = YAML.load("./swagger.yaml");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.use("/api", indexRouter);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use("*", (req, res) => {
  res
    .status(404)
    .json(formatResponse(404, "Not found", null, "Resource not found"));
});

const server = http.createServer(app);

server.on("upgrade", upgradeCb);
wss.on("connection", connectionCb);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = { app, server };
