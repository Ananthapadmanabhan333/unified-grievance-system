const { Grievance, GrievanceStatusLog, GrievanceCategory, Department, User, AIPrediction, Notification, sequelize } = require('../models');
const { Op } = require('sequelize');
const classificationService = require('./ai/classificationService');
const severityService = require('./ai/severityService');
const imageService = require('./ai/imageService');
const notificationService = require('./NotificationService');
const auditService = require('./AuditService');

class GrievanceService {
    /**
     * Create a new grievance with AI analysis and SLA calculation
     */
    async createGrievance(data, userId, context = {}) {
        const transaction = await sequelize.transaction();

        try {
            const { title, description, category, location, priority, images, tenantId } = data;

            // 1. Find or validate category
            let grievanceCategory = await GrievanceCategory.findOne({
                where: { name: category, isActive: true },
                include: [{ model: Department }]
            });

            if (!grievanceCategory) {
                // Fallback to legacy category mapping
                const deptCode = this.getDeptCodeByCategory(category);
                const department = await Department.findOne({ where: { code: deptCode, isActive: true } });

                if (!department) {
                    throw new Error('Invalid category: No matching department found');
                }

                grievanceCategory = { departmentId: department.id, defaultSLAHours: department.slaHours };
            }

            // 2. Run AI Analysis (Parallel)
            const aiStartTime = Date.now();

            const [aiResult, sentimentScore, imageAnalysis] = await Promise.all([
                classificationService.predict(description).catch(() => null),
                Promise.resolve(severityService.analyzeSentiment(description)),
                (images && images.length > 0) ? imageService.analyze(images[0]).catch(() => null) : Promise.resolve(null)
            ]);

            const aiProcessingTime = Date.now() - aiStartTime;

            // Calculate Severity (0-100)
            const severityScore = severityService.calculateSeverity(description, aiResult?.category || category);

            // Determine Integrity/Duplication (Placeholder for Phase 13)
            const isDuplicate = false;


            // 3. Calculate SLA
            const slaHours = grievanceCategory.defaultSLAHours || 48;
            const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

            // 4. Determine risk level
            const riskLevel = await aiService.predictRisk(grievanceCategory.departmentId);

            // 5. Create grievance
            const grievance = await Grievance.create({
                title,
                description,
                category,
                grievanceCategoryId: grievanceCategory.id,
                priority: priority || grievanceCategory.defaultPriority || 'Medium',
                location,
                images,
                userId,
                tenantId,
                departmentId: grievanceCategory.departmentId,
                status: 'Pending',
                slaDeadline,
                escalationLevel: 0,
                escalationLevel: 0,
                sentimentScore,
                severityScore,
                riskLevel,
                isDuplicate,
                aiClassification: aiResult // Store full result in JSON field
            }, { transaction });

            // 6. Store AI predictions
            if (aiResult) {
                await AIPrediction.create({
                    grievanceId: grievance.id,
                    predictionType: 'CATEGORY_CLASSIFICATION',
                    inputData: { text: description },
                    prediction: aiResult,
                    confidence: aiResult.confidence,
                    modelVersion: '2.0',
                    modelName: 'NaturalBayesClassifier',
                    processingTimeMs: aiProcessingTime,
                    wasAccepted: aiResult.category === category
                }, { transaction });
            }

            if (sentimentScore !== null) {
                await AIPrediction.create({
                    grievanceId: grievance.id,
                    predictionType: 'SENTIMENT_ANALYSIS',
                    inputData: { text: description },
                    prediction: { score: sentimentScore },
                    confidence: 1.0,
                    modelVersion: '1.0',
                    modelName: 'AFINNSentimentAnalyzer',
                    processingTimeMs: aiProcessingTime
                }, { transaction });
            }

            // 7. Create status log
            await GrievanceStatusLog.create({
                grievanceId: grievance.id,
                fromStatus: null,
                toStatus: 'Pending',
                changedBy: userId,
                remarks: 'Grievance submitted',
                isSystemAction: false,
                metadata: {
                    category,
                    department: grievanceCategory.Department?.name,
                    slaHours,
                    aiRisk: riskLevel
                }
            }, { transaction });

            // 8. Create notification for department
            await notificationService.createNotification({
                userId: grievanceCategory.Department?.headUserId,
                grievanceId: grievance.id,
                type: 'GRIEVANCE_SUBMITTED',
                title: 'New Grievance Submitted',
                message: `New ${priority} priority grievance in ${category} category`,
                priority: priority || 'Medium',
                metadata: { grievanceId: grievance.id }
            }, transaction);

            // 9. Audit log
            await auditService.log({
                userId,
                action: 'CREATE',
                entityType: 'Grievance',
                entityId: grievance.id,
                newValues: grievance.toJSON(),
                ipAddress: context.ip,
                userAgent: context.userAgent
            }, transaction);

            // 10. Award Karma Points (Gamification)
            const user = await User.findByPk(userId);
            if (user && user.role === 'Citizen') {
                await user.increment('karmaPoints', { by: 10, transaction });
            }

            await transaction.commit();

            // Return with full details
            return await this.getGrievanceById(grievance.id, userId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Update grievance status with audit trail
     */
    async updateStatus(grievanceId, statusData, userId, userRole, context = {}) {
        const transaction = await sequelize.transaction();

        try {
            const { status, remarks } = statusData;

            const grievance = await Grievance.findByPk(grievanceId, { transaction });
            if (!grievance) {
                throw new Error('Grievance not found');
            }

            const oldStatus = grievance.status;
            const oldValues = grievance.toJSON();

            // Update grievance
            grievance.status = status;
            if (status === 'Resolved' || status === 'Rejected') {
                grievance.closureRemarks = remarks;
                grievance.resolvedAt = new Date();
            }
            await grievance.save({ transaction });

            // Create status log
            await GrievanceStatusLog.create({
                grievanceId,
                fromStatus: oldStatus,
                toStatus: status,
                changedBy: userId,
                remarks,
                isSystemAction: false
            }, { transaction });

            // Create notification for citizen
            await notificationService.createNotification({
                userId: grievance.userId,
                grievanceId,
                type: `STATUS_CHANGED`,
                title: `Grievance ${status}`,
                message: `Your grievance #${grievance.uniqueId} status changed to ${status}`,
                priority: status === 'Resolved' ? 'High' : 'Medium'
            }, transaction);

            // Audit log
            await auditService.log({
                userId,
                userRole,
                action: 'UPDATE',
                entityType: 'Grievance',
                entityId: grievanceId,
                oldValues,
                newValues: grievance.toJSON(),
                ipAddress: context.ip,
                userAgent: context.userAgent
            }, transaction);

            await transaction.commit();

            return await this.getGrievanceById(grievanceId, userId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get grievance by ID with full details
     */
    async getGrievanceById(id, requestingUserId) {
        return await Grievance.findByPk(id, {
            include: [
                { model: User, as: 'submitter', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Department, attributes: ['id', 'name', 'code'] },
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: GrievanceCategory, as: 'categoryDetails' },
                { model: GrievanceStatusLog, as: 'statusHistory', order: [['createdAt', 'DESC']] },
                { model: AIPrediction, as: 'aiPredictions' }
            ]
        });
    }

    /**
     * Get grievances with filtering and pagination
     */
    async getGrievances(filters, pagination, user) {
        const { role, id, departmentId, jurisdictionId, tenantId } = user;
        const { page = 1, limit = 20, status, priority, category, search } = { ...filters, ...pagination };

        let where = {};
        let userFilter = {};

        // Role-based filtering
        if (role === 'Citizen') {
            where.userId = id;
        } else if (role === 'Department Officer' || role === 'Department Head') {
            if (!departmentId) throw new Error('Officer not assigned to a department');
            where.departmentId = departmentId;
        } else if (role === 'StateAdmin' && jurisdictionId) {
            // Get all child jurisdictions
            const childJurisdictions = await sequelize.models.Jurisdiction.findAll({
                where: { parentId: jurisdictionId }
            });
            const jurisdictionIds = childJurisdictions.map(j => j.id).concat(jurisdictionId);
            userFilter.jurisdictionId = { [Op.in]: jurisdictionIds };
        } else if (role === 'DistrictAdmin' && jurisdictionId) {
            userFilter.jurisdictionId = jurisdictionId;
        }

        // Tenant isolation
        if (tenantId) {
            where.tenantId = tenantId;
        }

        // Additional filters
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (category) where.category = category;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { uniqueId: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Grievance.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'submitter',
                    attributes: ['id', 'name', 'phone'],
                    where: Object.keys(userFilter).length > 0 ? userFilter : undefined
                },
                { model: Department, attributes: ['name', 'code'] },
                { model: User, as: 'assignee', attributes: ['name'] }
            ],
            order: [
                ['priority', 'DESC'],
                ['slaDeadline', 'ASC'],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });

        return {
            grievances: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    /**
     * Helper: Map category to department code (legacy support)
     */
    getDeptCodeByCategory(category) {
        const map = {
            'Roads': 'PUB',
            'Potholes': 'PUB',
            'Street Light': 'PWR',
            'No Power': 'PWR',
            'Electricity': 'PWR',
            'Water Supply': 'WAT',
            'Water Leakage': 'WAT',
            'Sanitation': 'SAN',
            'Garbage': 'SAN'
        };
        return map[category] || 'PUB';
    }
}

module.exports = new GrievanceService();
