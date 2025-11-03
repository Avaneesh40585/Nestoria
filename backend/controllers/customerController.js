const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Get customer profile
exports.getProfile = async (req, res) => {
  try {
    const customerId = req.user.id;

    const result = await pool.query(
      'SELECT CustomerID, Full_name, Email, PhoneNumber, Gender, Age, Address, Identity_No, TotalBookings FROM Customer WHERE CustomerID = $1',
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer: result.rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { full_name, phone_number, gender, age, address } = req.body;

    const result = await pool.query(
      `UPDATE Customer SET 
       Full_name = $1, PhoneNumber = $2, Gender = $3, Age = $4, Address = $5
       WHERE CustomerID = $6 RETURNING CustomerID, Full_name, Email, PhoneNumber, Gender, Age, Address, Identity_No, TotalBookings`,
      [full_name, phone_number, gender, age, address, customerId]
    );

    res.json({
      message: 'Profile updated successfully',
      customer: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { current_password, new_password } = req.body;

    // Verify current password
    const result = await pool.query(
      'SELECT Password FROM Customer WHERE CustomerID = $1',
      [customerId]
    );

    const validPassword = await bcrypt.compare(current_password, result.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(
      'UPDATE Customer SET Password = $1 WHERE CustomerID = $2',
      [hashedPassword, customerId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
};
