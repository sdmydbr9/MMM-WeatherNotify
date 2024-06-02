/* global Module */

/* MagicMirror²
 * Module: MMM-WeatherNotify
 *
 * By sudhamoy
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
    checkInterval: 60000, // Check for new alerts every 1 minute (in ms)
    initialDelay: 300000, // Initial delay of 5 minutes (in ms)
  },

  // Override start method to set up initial state.
  start: function () {
    this.log("Starting module: " + this.name);
    this.alertsSent = [];
    setTimeout(() => {
      this.scheduleNextCheck();
    }, this.config.initialDelay);
  },

  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
    if (notification === "WEATHER_ALERTS_UPDATED") {
      this.log("Received WEATHER_ALERTS_UPDATED notification");
      this.handleWeatherAlertUpdate(payload);
    }
  },

  // Handle the weather alert update.
  handleWeatherAlertUpdate: function (payload) {
    const newAlerts = this.getNewAlerts(payload.currentWeatherAlerts);
    if (newAlerts.length > 0) {
      this.sendWeatherAlert(newAlerts);
    }
  },

  // Identify new alerts that haven't been sent yet.
  getNewAlerts: function (alerts) {
    return alerts.filter(alert => !this.alertsSent.includes(alert.id));
  },

  // Function to send weather alerts.
  sendWeatherAlert: function (alerts) {
    alerts.forEach(alert => {
      const alertContent = this.formatAlertContent(alert);
      if (this.config.notificationType === "alert") {
        this.sendNotification("SHOW_ALERT", {
          title: this.config.alertTitle,
          message: alertContent,
          timer: this.config.alertDuration,
          alertClass: this.config.alertClass,
        });
        this.log(`Sent alert: ${alertContent}`);
      } else if (this.config.notificationType === "notification") {
        this.sendNotification("SHOW_ALERT", {
          type: "notification",
          title: this.config.notificationTitle,
          message: alertContent,
        });
        this.log(`Sent notification: ${alertContent}`);
      }
      this.alertsSent.push(alert.id);
    });
  },

  // Format the alert content.
  formatAlertContent: function (alert) {
    return `There is a new weather alert for your area, it says: ${alert.description}`;
  },

  // Schedule the next check for new alerts.
  scheduleNextCheck: function () {
    setTimeout(() => {
      this.sendNotification("REQUEST_WEATHER_ALERTS_UPDATE");
      this.scheduleNextCheck();
    }, this.config.checkInterval);
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
