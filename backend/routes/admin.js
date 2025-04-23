const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const authMiddleware = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// 🔹 Get all users
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// 🔹 Update user role
router.put('/users/:id/role', authMiddleware, isAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
});

// 🔹 Delete user
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// Get all services
router.get('/services', authMiddleware, isAdmin, async (req, res) => {
  try {
    const services = await Service.find().sort('title');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
});

// Create a new service
router.post('/services', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, description, department } = req.body;
    const service = new Service({ title, description, department });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
});

// Update a service
router.put('/services/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, description, department } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, department },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
});

// Delete a service
router.delete('/services/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
});

// Get all service requests
router.get('/service-requests/all', authMiddleware, isAdmin, async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('service', 'title description department')
      .populate('citizen', 'name email')
      .populate('assignedStaff', 'name email')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all service requests:', error);
    res.status(500).json({ message: 'Failed to fetch service requests', error: error.message });
  }
});

// Get all staff members
router.get('/users/staff', authMiddleware, isAdmin, async (req, res) => {
  try {
    const staff = await User.find({ role: 'STAFF' })
      .select('name email')
      .sort('name');
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ message: 'Failed to fetch staff members', error: error.message });
  }
});

// Assign staff to a service request
router.patch('/service-requests/:id/assign', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { staffId } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        assignedStaff: staffId,
        status: 'IN_PROGRESS',
        updatedAt: Date.now()
      },
      { new: true }
    )
    .populate('service', 'title description department')
    .populate('citizen', 'name email')
    .populate('assignedStaff', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error assigning staff to request:', error);
    res.status(500).json({ message: 'Failed to assign staff', error: error.message });
  }
});

// Update service request status
router.patch('/service-requests/:id/status', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    )
    .populate('service', 'title description department')
    .populate('citizen', 'name email')
    .populate('assignedStaff', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

// Get system statistics
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalRequests, totalServices] = await Promise.all([
      User.countDocuments(),
      ServiceRequest.countDocuments(),
      Service.countDocuments()
    ]);

    const requestsByStatus = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalRequests,
      totalServices,
      requestsByStatus: requestsByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;
