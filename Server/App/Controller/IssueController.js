const Issue = require('../Models/Issue.js');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;
    
    const imageURL = req.file ? req.file.path : null;

    
    if (!title || !description || !category || !latitude || !longitude || !imageURL)
      return res.status(400).json({ message: "All fields including image are required" });

    const location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const issue = new Issue({
      title,
      description,
      category,
      imageURL,
      location,
      createdBy: req.user.userId,
    });
    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};