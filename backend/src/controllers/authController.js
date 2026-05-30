const bcrypt = require('bcryptjs');
const { assignRoleFromEmail } = require('../utils/role');
const { findUserByEmail, findUserWithPasswordByEmail, createUser } = require('../models/userModel');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function signup(req, res) {
  try {
    const { email, password, role } = req.body;

    if (role !== undefined) {
      return res.status(400).json({
        message: 'Role cannot be set during signup.',
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email format.',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.',
      });
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        message: 'A user with this email already exists.',
      });
    }

    const assignedRole = assignRoleFromEmail(normalizedEmail);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser(normalizedEmail, passwordHash, assignedRole);

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        message: 'A user with this email already exists.',
      });
    }
    console.error('Signup error:', err.message);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await findUserWithPasswordByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

module.exports = { signup, login };
