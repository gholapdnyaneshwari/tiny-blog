import md5 from 'md5';
import User from '../models/User';

const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameValidationRegex = /^[a-zA-Z0-9_]+$/;
  const passwordValidationRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (nameValidationRegex.test(name) === false) {
    return res.status(400).json({
      success: false,
      message: 'Name can only contain letters, numbers, and underscores.'
    });
  }

  if (emailValidationRegex.test(email) === false) {
    return res.status(400).json({
      success: false,
      message: 'Email is not valid.'
    });
  }

  if (passwordValidationRegex.test(password) === false) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain both letters and numbers.'
    });
  };

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    const newUser = new User({
      name,
      email
    });
    newUser.password = md5(password);
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.'
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while registering the user.'
    });
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const existingUser = await User.findOne({
  email: email.trim(),
  password: md5(password)
}).select('-password');
  if (existingUser) {
    return res.json({
      success: true,
      message: 'Login successful.',
      user: existingUser,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }
};
export { postSignup, postLogin }

