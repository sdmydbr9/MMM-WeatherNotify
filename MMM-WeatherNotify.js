/* global Module */

/* MagicMirror²
 * Module: MMM-WeatherNotify
 *
 * By [Your Name]
 * MIT Licensed.
 */

Module.register("MMM-WeatherNotify", {
  // Default module configuration.
  defaults: {
    notificationType: "alert", // Options: "alert", "notification"
    alertDuration: 5000, // Duration to display the alert (in ms)
    alertTitle: "Weather Alert",
    alertClass: "dimmed medium",
    notificationTitle: "Weather Alert Notification",
  },

  // Override start method to set up initial state.
  start: function () {
    this.log("Starting module: " + this.name);
  },

  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
    if (notification === "WEATHER_ALERTS_UPDATED") {
      this.log("Received WEATHER_ALERTS_UPDATED notification");
      this.sendWeatherAlert(payload);
    }
  },

  // Function to send weather alerts.
  sendWeatherAlert: function (payload) {
    if (this.config.notificationType === "alert") {
      this.sendAlert(payload);
    } else if (this.config.notificationType === "notification") {
      this.sendBrowserNotification(payload);
    }
  },

  // Send an alert with the weather alert details.
  sendAlert: function (payload) {
    const alertTitle = this.config.alertTitle;
    const alertContent = this.formatAlertContent(payload);

    this.sendNotification("SHOW_ALERT", {
      title: alertTitle,
      message: alertContent,
      timer: this.config.alertDuration,
      alertClass: this.config.alertClass,
    });

    this.log(`Sent alert: ${alertTitle} - ${alertContent}`);
  },

  // Send a browser notification with the weather alert details.
  sendBrowserNotification: function (payload) {
    const notificationTitle = this.config.notificationTitle;
    const notificationContent = this.formatAlertContent(payload);

    new Notification(notificationTitle, {
      body: notificationContent,
      icon: "modules/MMM-WeatherNotify/weather-icon.png", // Optional: Add your custom icon
    });

    this.log(`Sent notification: ${notificationTitle} - ${notificationContent}`);
  },

  // Format the alert content.
  formatAlertContent: function (payload) {
    let content = "There is a new weather alert for your area, it says: ";
    if (payload.currentWeatherAlerts.length > 0) {
      content += payload.currentWeatherAlerts[0].description;
    } else {
      content += "No active alerts.";
    }
    return content;
  },

  // This module doesn't need to display any content.
  getDom: function () {
    return document.createElement("div");
  },

  // Log messages to the Node helper for debugging.
  log: function (message) {
    this.sendSocketNotification("LOG_MESSAGE", message);
  },
});
