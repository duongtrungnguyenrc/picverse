export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    try {
      new Notification(title, options);
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }
}
