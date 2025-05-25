const User = require('../models/User');
const EmergencyContact = require('../models/EmergencyContact');
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    

    const user = new User({ username, email, password });
    await user.save();
    

    req.session.userId = user._id;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    

    req.session.userId = user._id;
    
    res.json({ 
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};





exports.setupInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@ab.com',
        password: 'Admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Initial admin created');
    }

    const contactsCount = await EmergencyContact.countDocuments();
    if (contactsCount === 0) {
      const defaultContacts = [
        {
          type: "Veterinary Emergency",
          phone: "(011) 123-4567",
          description: "24/7 emergency veterinary services"
        },
        {
          type: "Pet Poison Control",
          phone: "(011) 987-6543",
          description: "Immediate assistance for potential poisonings"
        },
        {
          type: "Animal Ambulance",
          phone: "(011) 456-7890",
          description: "Emergency pet transportation"
        },
        {
          type: "Pet First Aid Hotline",
          phone: "(011) 789-0123",
          description: "Immediate first aid instructions"
        }
      ];
      
      await EmergencyContact.insertMany(defaultContacts);
      console.log('Default emergency contacts created');
    }
  } catch (error) {
    console.error('Error in initial setup:', error);
  }
};