import express from "express";
import client from "prom-client";
import logger from "./logger";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  //A Histogram metric that records how long your REST API requests take.
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});
export const databseResponseTimeHistogram = new client.Histogram({
  //A Histogram metric for measuring how long your database queries take.
  name: "db_response_time_duration_seconds",
  help: "DATABASE response time in seconds",
  labelNames: ["operation", "success"],
});

export function startMetricServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    return res.send(await client.register.metrics());
  });

  app.listen(9100, () => {
    logger.info("metric server started at http://localhost:9100");
  });
}
