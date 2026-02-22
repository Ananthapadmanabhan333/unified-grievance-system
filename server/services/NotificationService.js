const { Notification } = require('../models');

class NotificationService {
    /**
     * Create a notification
     */
    async createNotification(data, transaction = null) {
        const {
            userId,
            grievanceId,
            type,
            title,
            message,
            priority = 'Medium',
            channel = 'IN_APP',
            metadata = {}
        } = data;

        if (!userId) {
            // Skip if no recipient (e.g., department head not assigned)
            return null;
        }

        try {
            const notification = await Notification.create({
                userId,
                grievanceId,
                type,
                title,
                message,
                priority,
                channel,
                metadata,
                deliveryStatus: 'PENDING'
            }, transaction ? { transaction } : {});

            // TODO: Integrate with actual notification channels (Email, SMS, Push)
            // For now, just mark as sent for IN_APP
            if (channel === 'IN_APP') {
                notification.deliveryStatus = 'SENT';
                notification.sentAt = new Date();
                await notification.save(transaction ? { transaction } : {});
            }

            return notification;
        } catch (error) {
            console.error('Notification creation failed:', error);
            // Don't throw - notifications are non-critical
            return null;
        }
    }

    /**
     * Create bulk notifications
     */
    async createBulkNotifications(notifications, transaction = null) {
        const results = await Promise.allSettled(
            notifications.map(notif => this.createNotification(notif, transaction))
        );
        return results.filter(r => r.status === 'fulfilled').map(r => r.value);
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        const notification = await Notification.findOne({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        return notification;
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId, options = {}) {
        const { limit = 20, offset = 0, unreadOnly = false } = options;

        const where = { userId };
        if (unreadOnly) {
            where.isRead = false;
        }

        const { count, rows } = await Notification.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            notifications: rows,
            total: count,
            unreadCount: await Notification.count({ where: { userId, isRead: false } })
        };
    }

    /**
     * Create SLA breach notification
     */
    async notifySLABreach(grievance, escalationLevel) {
        const notifications = [];

        // Notify department head
        if (grievance.Department?.headUserId) {
            notifications.push({
                userId: grievance.Department.headUserId,
                grievanceId: grievance.id,
                type: 'SLA_BREACH',
                title: 'SLA Breach Alert',
                message: `Grievance #${grievance.uniqueId} has breached SLA deadline`,
                priority: 'Critical',
                metadata: { escalationLevel }
            });
        }

        // Notify citizen
        notifications.push({
            userId: grievance.userId,
            grievanceId: grievance.id,
            type: 'SLA_BREACH',
            title: 'Grievance Escalated',
            message: `Your grievance #${grievance.uniqueId} has been escalated due to SLA breach`,
            priority: 'High',
            metadata: { escalationLevel }
        });

        return await this.createBulkNotifications(notifications);
    }

    /**
     * Create SLA warning notification (proactive)
     */
    async notifySLAWarning(grievance, hoursRemaining) {
        if (!grievance.assignedTo) return null;

        return await this.createNotification({
            userId: grievance.assignedTo,
            grievanceId: grievance.id,
            type: 'SLA_WARNING',
            title: 'SLA Deadline Approaching',
            message: `Grievance #${grievance.uniqueId} SLA deadline in ${hoursRemaining} hours`,
            priority: 'High',
            metadata: { hoursRemaining }
        });
    }
}

module.exports = new NotificationService();
