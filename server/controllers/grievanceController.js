const { Grievance, ActionLog, User, Department } = require('../models');

exports.createGrievance = async (req, res) => {
    try {
        const { title, description, category, location, priority, images } = req.body;

        // Auto-assign to Department (Mock Logic: Assign to first available for now)
        const department = await Department.findOne();

        // Calculate SLA
        const slaHours = department ? department.slaHours : 48;
        const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

        const grievance = await Grievance.create({
            title, description, category, location, priority,
            userId: req.user.id,
            departmentId: department ? department.id : null,
            status: 'Pending',
            slaDeadline,
            images: images || []
        });

        await ActionLog.create({
            grievanceId: grievance.id,
            action: 'Submitted',
            details: 'Grievance submitted by citizen',
            performedBy: req.user.id
        });

        res.status(201).json(grievance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllGrievances = async (req, res) => {
    try {
        const { role, id } = req.user;
        let where = {};

        // Citizens see only their own, others see all (for MVP simplification)
        if (role === 'Citizen') {
            where.userId = id;
        }

        const grievances = await Grievance.findAll({
            where,
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Department, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const grievance = await Grievance.findByPk(req.params.id);

        if (!grievance) return res.status(404).json({ error: 'Grievance not found' });

        const oldStatus = grievance.status;
        grievance.status = status;
        await grievance.save();

        await ActionLog.create({
            grievanceId: grievance.id,
            action: `Status Updated: ${oldStatus} -> ${status}`,
            details: remarks || '',
            performedBy: req.user.id
        });

        res.json(grievance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
