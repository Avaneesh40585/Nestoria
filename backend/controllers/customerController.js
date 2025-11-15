const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Get customer profile
exports.getProfile = async (req, res) => {
  try {
    const customerId = req.user.id;

    const result = await pool.query(
      'SELECT CustomerID, Full_Name, Email, Phone_Number, Gender, Age, Address, Total_Bookings FROM Customer WHERE CustomerID = $1',
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

    console.log('📝 Updating customer profile:', customerId);
    console.log('Data received:', { full_name, phone_number, gender, age, address });

    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (full_name !== undefined) {
      updates.push(`Full_Name = $${paramCounter}`);
      values.push(full_name);
      paramCounter++;
    }
    if (phone_number !== undefined) {
      updates.push(`Phone_Number = $${paramCounter}`);
      values.push(phone_number);
      paramCounter++;
    }
    if (gender !== undefined) {
      updates.push(`Gender = $${paramCounter}`);
      values.push(gender);
      paramCounter++;
    }
    if (age !== undefined) {
      updates.push(`Age = $${paramCounter}`);
      values.push(age);
      paramCounter++;
    }
    if (address !== undefined) {
      updates.push(`Address = $${paramCounter}`);
      values.push(address);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(customerId);
    const query = `UPDATE Customer SET ${updates.join(', ')} WHERE CustomerID = $${paramCounter} RETURNING CustomerID, Full_Name, Email, Phone_Number, Gender, Age, Address, Total_Bookings`;

    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);

    console.log('✅ Profile updated successfully');

    res.json({
      message: 'Profile updated successfully',
      customer: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
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
