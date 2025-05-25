const multer = require('multer');
const Post = require('../models/Post');
const Reply = require('../models/Reply');
const User = require('../models/User');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });


exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.session.userId;

    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    
    const post = new Post({ content, user: userId, image: imagePath });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};


exports.createReply = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.session.userId;

    const reply = new Reply({ content, user: userId, post: postId });
    await reply.save();

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: 'Error creating reply', error: err.message });
  }
};


exports.getRepliesForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const replies = await Reply.find({ post: postId }).populate('user', 'username');
    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching replies', error: err.message });
  }
};


exports.editPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
  
      
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.user.toString() !== req.session.userId) {
        return res.status(403).json({ message: 'You are not authorized to edit this post' });
      }
  
      
      post.content = content || post.content;
      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }
  
      await post.save();
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: 'Error editing post', error: err.message });
    }
  };
  
  

exports.deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.user.toString() !== req.session.userId) {
        return res.status(403).json({ message: 'You are not authorized to delete this post' });
      }
  
    
      await Post.findByIdAndDelete(postId);
      
      
      await Reply.deleteMany({ post: postId });
      
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error('Delete post error:', err);
      res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
  };
  


exports.upload = upload;
