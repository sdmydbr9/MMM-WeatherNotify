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
    notificationType: "basic",
  },

  // Required styles for the module.
  getStyles: function () {
    return ["MMM-WeatherNotify.css"];
  },

  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
    if (notification === "WEATHER_ALERTS_UPDATED") {
      this.sendWeatherAlert(payload);
    }
  },

  // Function to send weather alerts.
  sendWeatherAlert: function (payload) {
    if (this.config.notificationType === "alert") {
      this.sendAlert(payload);
    } else if (this.config.notificationType === "notification") {
      this.sendNotification(payload);
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
  },

  // Send a notification with the weather alert details.
  sendNotification: function (payload) {
    const notificationTitle = this.config.notificationTitle;
    const notificationContent = this.formatAlertContent(payload);

    new Notification(notificationTitle, {
      body: notificationContent,
      icon: "modules/MMM-WeatherNotify/weather-icon.png", // Optional: Add your custom icon
    });
  },

  // Format the alert content.
  formatAlertContent: function (payload) {
    let content = "Weather Alerts:\n";
    if (payload.currentWeatherAlerts.length > 0) {
      payload.currentWeatherAlerts.forEach((alert, index) => {
        content += `\nAlert ${index + 1}:\n`;
        content += `Title: ${alert.event}\n`;
        content += `Description: ${alert.description}\n`;
        content += `Start: ${new Date(alert.start * 1000).toLocaleString()}\n`;
        content += `End: ${new Date(alert.end * 1000).toLocaleString()}\n`;
        content += `Severity: ${alert.severity}\n`;
      });
    } else {
      content += "No active alerts.";
    }
    return content;
  },
});