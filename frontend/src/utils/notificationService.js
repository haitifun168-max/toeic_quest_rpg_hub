/**
 * notificationService.js
 * Quản lý Push Notification & Thông báo nhắc nhở học tập Daily Quests / Streak protection.
 */

export const NotificationService = {
  /**
   * Đăng ký nhận thông báo (Mock / Web + Mobile compat)
   */
  async registerForPushNotifications() {
    console.log('[NotificationService] Requesting notification permissions...');
    return { status: 'granted', token: 'mock-expo-push-token-12345' };
  },

  /**
   * Lên lịch thông báo nhắc học trước 22h00 hàng ngày nếu chưa xong quest
   */
  async scheduleDailyReminder(hour = 21, minute = 0) {
    console.log(`[NotificationService] Scheduled daily reminder for ${hour}:${minute}`);
    return 'reminder-job-id-daily-2100';
  },

  /**
   * Gửi thông báo khẩn cấp bảo vệ Streak khi người dùng lỡ ngày học
   */
  async triggerStreakProtectionAlert(currentStreak) {
    console.log(`[NotificationService] Streak protection alert triggered! Current streak: ${currentStreak}`);
    return {
      title: '🔥 Cảnh báo Streak!',
      body: `Bạn chưa làm nhiệm vụ hôm nay! Hãy học ngay hoặc dùng 500 KP kích hoạt Streak Freeze để giữ ${currentStreak} ngày chuỗi!`,
    };
  }
};
