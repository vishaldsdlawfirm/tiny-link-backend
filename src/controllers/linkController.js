import Link from "../models/Link.js";

// Helper function to validate URL
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to generate random code
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// POST /api/links - Create short URL
export const createLink = async (req, res) => {
  try {
    const { longUrl } = req.body;

    // Check if longUrl is provided
    if (!longUrl) {
      return res.status(400).json({ message: "Long URL is required" });
    }

    // Validate URL format
    if (!validateUrl(longUrl)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Generate unique code
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = generateRandomCode();
      const exists = await Link.findOne({ code });
      if (!exists) {
        isUnique = true;
      }
    }

    // Create short URL in database
    const newLink = await Link.create({ 
      longUrl, 
      code 
    });

    // Create the short URL
    const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;

    // Return response with only necessary data
    res.status(201).json({
      success: true,
      longUrl: longUrl,
      shortUrl: shortUrl,
      code: code
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// GET /api/links - Get all URLs
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    
    // Format response with shortUrl
    const formattedLinks = links.map(link => ({
      _id: link._id,
      longUrl: link.longUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${link.code}`,
      code: link.code,
      clickCount: link.clickCount,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    }));
    
    res.json({
      success: true,
      count: formattedLinks.length,
      data: formattedLinks
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// DELETE /api/links/:id - Delete URL by ID
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Link ID is required" 
      });
    }

    const deletedLink = await Link.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ 
        success: false,
        message: "Link not found" 
      });
    }

    res.json({
      success: true,
      message: "Link deleted successfully",
      deletedLink: {
        _id: deletedLink._id,
        longUrl: deletedLink.longUrl,
        code: deletedLink.code
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

