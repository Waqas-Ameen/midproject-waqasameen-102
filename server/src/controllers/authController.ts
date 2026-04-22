import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, verifyToken } from '../middlewares/auth';
import { RegisterInput, LoginInput } from '../../../shared/schemas';

/**
 * User registration
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body as RegisterInput;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user profile in MongoDB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'client',
      status: 'active',
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * User login
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as LoginInput;

    // Get user profile from MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Verify token and get current user
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Logout (client-side only, but provided for completeness)
 */
export async function logout(req: Request, res: Response) {
  try {
    // Note: With stateless JWTs, literal server-side logout usually involves blacklisting tokens,
    // but returning a success here clears client-side state.
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Refresh token
 */
export async function refreshToken(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid token',
      });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const newToken = generateToken(decoded.sub, decoded.email, decoded.role);

    return res.status(200).json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

