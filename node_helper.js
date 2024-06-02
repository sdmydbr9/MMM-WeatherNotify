const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
  start: function () {
    this.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LOG_MESSAGE") {
      this.log(payload);
    }
  },

  log: function (message) {
    const logFilePath = path.join(__dirname, "weather_notify_log.txt");
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Failed to write log:", err);
      }
    });
  },
});
