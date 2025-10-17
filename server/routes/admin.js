import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   PATCH /api/admin/users/:userId/role
// @desc    Change user role (admin only)
// @access  Admin
router.patch('/users/:userId/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PATCH /api/admin/make-me-admin
// @desc    Make current user admin (temporary endpoint for setup)
// @access  Private
router.patch('/make-me-admin', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    res.json({ 
      success: true, 
      message: 'You are now an admin!',
      user 
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
