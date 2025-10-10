const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { full_name, email, password, phone_number, gender, age, address, identity_no } = req.body;

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT * FROM Customer WHERE Email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert customer
    const result = await pool.query(
      `INSERT INTO Customer (Full_name, Email, Password, PhoneNumber, Gender, Age, Address, Identity_No)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING CustomerID, Full_name, Email`,
      [full_name, email, hashedPassword, phone_number, gender, age, address, identity_no]
    );

    const customer = result.rows[0];
    const token = jwt.sign(
      { id: customer.customerid, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      user: {
        id: customer.customerid,
        name: customer.full_name,
        email: customer.email,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

// Host Registration
exports.registerHost = async (req, res) => {
  try {
    const { full_name, email, password, phone_number, gender, age, address, identity_no } = req.body;

    const existingHost = await pool.query(
      'SELECT * FROM Host WHERE Email = $1',
      [email]
    );

    if (existingHost.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO Host (Full_name, Email, Password, PhoneNumber, Gender, Age, Address, Identity_No)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING HostID, Full_name, Email`,
      [full_name, email, hashedPassword, phone_number, gender, age, address, identity_no]
    );

    const host = result.rows[0];
    const token = jwt.sign(
      { id: host.hostid, email: host.email, role: 'host' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Host registered successfully',
      token,
      user: {
        id: host.hostid,
        name: host.full_name,
        email: host.email,
        role: 'host'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM Customer WHERE Email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const customer = result.rows[0];
    const validPassword = await bcrypt.compare(password, customer.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer.customerid, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: customer.customerid,
        name: customer.full_name,
        email: customer.email,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Host Login
exports.loginHost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM Host WHERE Email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const host = result.rows[0];
    const validPassword = await bcrypt.compare(password, host.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: host.hostid, email: host.email, role: 'host' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: host.hostid,
        name: host.full_name,
        email: host.email,
        role: 'host'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
