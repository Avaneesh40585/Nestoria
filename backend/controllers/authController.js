const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Customer Registration  
exports.registerCustomer = async (req, res) => {
  try {
    const { full_name, email, password, phone_number, gender, age, address } = req.body;
    
    console.log('Registration attempt - Customer:', { email, full_name });

    // Check if email already exists (optimized to select only ID)
    const existingUser = await pool.query(
      'SELECT CustomerID FROM Customer WHERE Email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate CustomerID
    const customerCountResult = await pool.query('SELECT COUNT(*) as count FROM Customer');
    const customerCount = parseInt(customerCountResult.rows[0].count) + 1;
    const customerId = `CUST${String(customerCount).padStart(8, '0')}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert customer
    const result = await pool.query(
      `INSERT INTO Customer (CustomerID, Full_Name, Email, Password, Phone_Number, Gender, Age, Address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING CustomerID, Full_Name, Email`,
      [customerId, full_name, email, hashedPassword, phone_number, gender, age, address]
    );

    const customer = result.rows[0];
    console.log('Customer created:', customer.customerid);
    const token = jwt.sign(
      { id: customer.customerid, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Customer registered successfully',
      data: {
        token,
        user: {
          id: customer.customerid,
          name: customer.full_name,
          email: customer.email,
          role: 'customer'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    let errorMessage = 'Registration failed';
    
    if (error.message.includes('customer_email_key')) {
      errorMessage = 'Email already registered';
    } else if (error.message.includes('customer_phonenumber_key')) {
      errorMessage = 'Phone number already registered';
    }
    
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};

// Host Registration
exports.registerHost = async (req, res) => {
  try {
    const { full_name, email, password, phone_number, gender, age, address } = req.body;
    
    console.log('Registration attempt - Host:', { email, full_name });

    const existingHost = await pool.query(
      'SELECT HostID FROM Host WHERE Email = $1',
      [email]
    );

    if (existingHost.rows.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate HostID
    const hostCountResult = await pool.query('SELECT COUNT(*) as count FROM Host');
    const hostCount = parseInt(hostCountResult.rows[0].count) + 1;
    const hostId = `HOST${String(hostCount).padStart(8, '0')}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO Host (HostID, Full_Name, Email, Password, Phone_Number, Gender, Age, Address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING HostID, Full_Name, Email`,
      [hostId, full_name, email, hashedPassword, phone_number, gender, age, address]
    );

    const host = result.rows[0];
    console.log('Host created:', host.hostid);
    const token = jwt.sign(
      { id: host.hostid, email: host.email, role: 'host' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Host registered successfully',
      data: {
        token,
        user: {
          id: host.hostid,
          name: host.full_name,
          email: host.email,
          role: 'host'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    let errorMessage = 'Registration failed';
    
    if (error.message.includes('host_email_key')) {
      errorMessage = 'Email already registered';
    } else if (error.message.includes('host_phonenumber_key')) {
      errorMessage = 'Phone number already registered';
    }
    
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT CustomerID, Full_name, Email, Password FROM Customer WHERE Email = $1',
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
      data: {
        token,
        user: {
          id: customer.customerid,
          name: customer.full_name,
          email: customer.email,
          role: 'customer'
        }
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
      'SELECT HostID, Full_name, Email, Password FROM Host WHERE Email = $1',
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
      data: {
        token,
        user: {
          id: host.hostid,
          name: host.full_name,
          email: host.email,
          role: 'host'
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
