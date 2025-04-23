const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const authMiddleware = require('../middleware/auth');

// Create a service request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, description, priority } = req.body;
    
    const serviceRequest = new ServiceRequest({
      service: serviceId,
      citizen: req.user.id,
      description,
      priority
    });

    await serviceRequest.save();
    
    const populatedRequest = await ServiceRequest.findById(serviceRequest._id)
      .populate('service', 'title department')
      .populate('citizen', 'name email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ message: 'Failed to create service request', error: error.message });
  }
});

// Get user's service requests
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ citizen: req.user.id })
      .populate('service', 'title department')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ message: 'Failed to fetch service requests', error: error.message });
  }
});

// Get a specific service request
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('service', 'title department')
      .populate('citizen', 'name email');
    
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Only allow the citizen who created the request to view it
    if (request.citizen._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ message: 'Failed to fetch service request', error: error.message });
  }
});

module.exports = router;
