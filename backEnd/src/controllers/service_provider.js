const mongoose = require("mongoose");
const { tools } = require("../models/machinerySchrms");
const farmer = require("../models/farmerSchema");

// =======================
// 1. REGISTER FARMER
// =======================
const register = async (req, res) => {
  try {
    const { name, contact, lng, lat, chat } = req.body;

    if (!name || !contact || !lng || !lat) {
      return res.status(400).json({
        success: false,
        message: "Name, contact, lng, and lat are required.",
      });
    }

    const existingFarmer = await farmer.findOne({ contact });
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer with this contact already exists.",
      });
    }

    const newFarmer = await farmer.create({
      name,
      contact,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      chat: {
        chatUserId: chat?.chatUserId || null,
        displayName: chat?.displayName || name,
        isChatUser: chat?.isChatUser || false,
        uniqueId: chat?.uniqueId || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Farmer registered successfully.",
      farmer: newFarmer,
    });
  } catch (err) {
    console.error("Error in farmer registration:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: err.message,
    });
  }
};

// =======================
// 2. REGISTER TOOL
// =======================
const registerTools = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      rentPrice,
      rentUnit,
      lng,
      lat,
      image,
    } = req.body;

    const farmerId = req.user._id;
    console.log(req.body);
    // =========================
    // VALIDATION
    // =========================
    if (
      !name ||
      !category ||
      !rentPrice ||
      !rentUnit ||
      !lng ||
      !lat ||
      !farmerId ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // =========================
    // IMAGE HANDLING (FIXED)
    // =========================
    let imageData = {};

    // Case 1: Cloudinary response object
    if (typeof image === "object") {
      imageData = {
        url: image.secure_url || image.url,
        public_id: image.public_id,
      };
    }

    // Case 2: Only URL string (fallback)
    else if (typeof image === "string") {
      imageData = {
        url: image,
        public_id: null,
      };
    }

    // =========================
    // FARMER CHECK
    // =========================
    const existingFarmer = await farmer.findById(farmerId);
    if (!existingFarmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found.",
      });
    }

    // =========================
    // CREATE TOOL
    // =========================
    const tool = await tools.create({
      name,
      description,
      category,
      rentPrice,
      rentUnit,

      image: imageData,

      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)], // ensure numbers
      },

      farmer: farmerId,
      chat: existingFarmer.chat,
    });

    res.status(201).json({
      success: true,
      message: "Tool registered successfully.",
      tool,
    });
  } catch (err) {
    console.error("Error registering tool:", err.message);

    res.status(500).json({
      success: false,
      message: "Server error while registering tool",
      error: err.message,
    });
  }
};

// =======================
// 3. GET TOOLS OF SPECIFIC FARMER
// =======================
const getSpecificFarmerTools = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    const Tools = await tools.find({ farmer: farmerId });

    if (!Tools.length) {
      return res.status(404).json({
        success: false,
        message: "No tools found for this farmer",
      });
    }

    res.json({
      success: true,
      count: Tools.length,
      Tools,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// 4. GET ALL TOOLS (FILTER + GEO + PAGINATION)
// =======================
const getAllTools = async (req, res) => {
  try {
    let {
      available,
      minPrice,
      maxPrice,
      rating,
      category,
      isFeatured,
      sort, // <-- from frontend (price-asc etc)
      order,
      search,
      lat,
      lng,
      maxDistance,
      page,
      limit,
    } = req.query;

    const Page = Math.max(1, Number(page) || 1);
    const Limit = Math.max(1, Number(limit) || 10);
    const skip = (Page - 1) * Limit;

    maxDistance = maxDistance ? Number(maxDistance) : 5000;

    let pipeline = [];

    // ================= GEO =================
    if (lat && lng) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance,
        },
      });
    }

    // ================= FILTER =================
    let matchStage = {};

    if (available !== undefined) {
      matchStage.available = available === "true";
    }

    if (rating) {
      matchStage.rating = { $gte: Number(rating) };
    }

    if (category) {
      matchStage.category = category;
    }

    if (isFeatured !== undefined) {
      matchStage.isFeatured = isFeatured === "true";
    }

    if (minPrice || maxPrice) {
      matchStage.rentPrice = {};
      if (minPrice) matchStage.rentPrice.$gte = Number(minPrice);
      if (maxPrice) matchStage.rentPrice.$lte = Number(maxPrice);
    }

    // ================= SEARCH =================
    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // ================= SORT LOGIC =================
    let sortStage = { createdAt: -1 };

    if (sort) {
      if (sort === "price-asc") sortStage = { rentPrice: 1 };
      else if (sort === "price-desc") sortStage = { rentPrice: -1 };
      else if (sort === "rating-desc") sortStage = { rating: -1 };
      else if (sort === "newest") sortStage = { createdAt: -1 };
    }

    // ================= LOOKUP =================
    pipeline.push({
      $lookup: {
        from: "farmers",
        localField: "farmer",
        foreignField: "_id",
        as: "farmer",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$farmer",
        preserveNullAndEmptyArrays: true,
      },
    });

    // ================= SORT =================
    pipeline.push({ $sort: sortStage });

    // ================= PAGINATION =================
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: Limit }],
      },
    });

    const [result] = await tools.aggregate(pipeline);

    const totalCount = result.metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / Limit);

    res.json({
      success: true,
      tools: result.data,
      totalCount,
      totalPages,
      currentPage: Page,
      count: result.data.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyTools = async (req, res) => {
  try {
    const farmerId = req.user._id;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID not found in request.",
      });
    }

    // Fetch tools created by this farmer
    const myTools = await tools
      .find({ farmer: farmerId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    if (!myTools || myTools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tools found.",
        tools: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Tools fetched successfully.",
      tools: myTools,
    });
  } catch (err) {
    console.error("Error fetching tools:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tools.",
      error: err.message,
    });
  }
};

const deleteTool = async (req, res) => {
  try {
    const { toolId } = req.params;
    const farmerId = req.user._id;

    // =========================
    // VALIDATE TOOL ID
    // =========================
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tool ID",
      });
    }

    // =========================
    // FIND TOOL
    // =========================
    const tool = await tools.findById(toolId);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    // =========================
    // AUTHORIZATION CHECK
    // =========================
    if (tool.farmer.toString() !== farmerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this tool",
      });
    }

    // =========================
    // DELETE IMAGE (OPTIONAL - Cloudinary)
    // =========================
    if (tool.image?.public_id) {
      try {
        const cloudinary = require("cloudinary").v2;
        await cloudinary.uploader.destroy(tool.image.public_id);
      } catch (imgErr) {
        console.error("Image delete failed:", imgErr.message);
        // continue anyway (don’t block deletion)
      }
    }

    // =========================
    // DELETE TOOL
    // =========================
    await tool.deleteOne();

    res.status(200).json({
      success: true,
      message: "Tool deleted successfully",
    });
  } catch (err) {
    console.error("Delete tool error:", err.message);

    res.status(500).json({
      success: false,
      message: "Server error while deleting tool",
      error: err.message,
    });
  }
};
module.exports = {
  register,
  registerTools,
  getSpecificFarmerTools,
  getAllTools,
  getMyTools,
  deleteTool,
};

/*
        // https://gemini.google.com/app/d0b28c48c22a8a39?hl=en-IN read about much for above code 
        // https://chatgpt.com/c/68a6ced6-da3c-8327-b6da-f6c2f1d02f6e
        // 
*/

// manything to add;

// populate is like JOIN , add two collection based on condition
// Now if you add .populate("serviceProvider"), Mongoose replaces that ObjectId with the full provider document from the ServiceProvider collection
// You can also control what fields to bring (e.g., .populate("serviceProvider", "name contact") will only return those).
//
// he $lookup operator in MongoDB is a powerful tool used for performing left outer joins between documents from two collections. This operator allows you to merge data from different collections based on specified criteria, enhancing and analyzing data across multiple documents.

/*  Example Requests:

// All tools (no filters):

// GET /api/tools


// Available tractors only:

// GET /api/tools?available=true&category=Tractor


// Sort by price ascending:

// GET /api/tools?sortBy=price&order=asc


// Nearby within 3km:

// GET /api/tools?lat=28.6139&lng=77.2090&maxDistance=3000


// Price range + rating filter:

// GET /api/tools?minPrice=100&maxPrice=500&rating=4 */

/*
Externally:

This executes the query you just built dynamically (with filters + sorting).
User only sees the final filtered + sorted list of tools.

Internally:

MongoDB goes through the pipeline step by step:

$geoNear (if given) → finds nearest providers.
$lookup → attaches provider data.
$match → filters tools (available, rating, price, etc.).
$sort → orders the results.

MongoDB streams the documents stage by stage → finally returns an array of JSON objects.
 */

// add text search
// filter by rent unit
// Caching (Optional but Powerful)
// If getAllTools is hit often, add Redis caching:
// Key: tools:${JSON.stringify(req.query)}
// If found in Redis → return cached.
// Else → query MongoDB → set in Redis.

//7. Error Handling Improvements

// Right now only 500.
// Add 404 case if no tools found:

// if (!result.length) {
//   return res.status(404).json({ success: false, message: "No tools found" });
// }

//8. Nearby Sorting (if location is given)

// Right now, you filter nearby, but maybe farmer wants them sorted by closest distance:

// if (lat && lng && sortBy === "distance") {
//   pipeline.push({ $sort: { distance: 1 } });
// }

// Client Request
//  ↓
// Parse query params (filters, sorting, pagination, location)
//  ↓
// Build pipeline (geoNear → lookup → match → sort → skip/limit → project)
//  ↓
// Check Redis cache (if enabled)
//  ↓
// MongoDB aggregate(pipeline)
//  ↓
// Format response (totalPages, currentPage, count, tools[])
//  ↓
// Send JSON response
