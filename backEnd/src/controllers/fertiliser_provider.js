const { s_and_f } = require("../models/seedsFertiliser");
const farmer = require("../models/farmerSchema");

// =======================
// SELL SEED / FERTILISER
// =======================
const sellSeedAndFertiliser = async (req, res) => {
  try {
    const { name, category, brand, price } = req.body;
    const seller = req.user._id;
    if (!name || !category || !brand || !price || !seller) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, category, brand, price, seller) are required.",
      });
    }

    const farmerId = seller;

    const farmerData = await farmer.findById(farmerId);
    if (!farmerData) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found.",
      });
    }

    const s_and_fs = await s_and_f.create({
      ...req.body,
      seller: {
        name: farmerData.fullName,
        contact: farmerData.mobileNumber,
        farmer: farmerData._id,
      },
      chat:farmerData.chat,
    });

    res.status(201).json({
      success: true,
      message: "Seed/Fertiliser registered successfully.",
      s_and_fs,
    });
  } catch (err) {
    console.error("Error registering product:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while registering product.",
      error: err.message,
    });
  }
};

// =======================
// QUANTITY MANIPULATOR
// =======================
const QuantityManipulator = async (req, res) => {
  try {
    let { quantity, productId } = req.body;

    const product = await s_and_f.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stockQuantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock" });
    }

    product.stockQuantity -= quantity;

    if (product.stockQuantity === 0) {
      product.stockAvailable = false;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
};

// =======================
// UPDATE PRICE / DISCOUNT
// =======================
const updatePriceAndDisOfSeedAndFertiliser = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price, discount } = req.body;

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid price value" });
    }

    if (
      discount !== undefined &&
      (typeof discount !== "number" || discount < 0 || discount > 100)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Discount must be between 0–100%" });
    }

    const product = await s_and_f.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;

    await product.save();

    res.json({
      success: true,
      message: "Product pricing updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product pricing:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =======================
// BUY PRODUCT
// =======================
const buySeedAndFertiliser = async (req, res) => {
  try {
    const { farmerId, productId, quantity, finalPrice } = req.body;

    const product = await s_and_f.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stockQuantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock" });
    }

    product.stockQuantity -= quantity;
    if (product.stockQuantity === 0) {
      product.stockAvailable = false;
    }

    await product.save();

    const updatedFarmer = await farmer.findByIdAndUpdate(
      farmerId,
      {
        $push: {
          myOrders: {
            orderType: product.category,
            product: product._id,
            quantity,
            price: finalPrice,

            //  FIXED (seller farmer)
            farmer: product.seller.farmer,

            purchasedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Purchase successful",
      farmer: updatedFarmer,
      product,
    });
  } catch (err) {
    console.error("Error recording farmer order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// REMOVE PRODUCT
// =======================
const removeProduct = async (req, res) => {
  try {
    const { farmerId, productId } = req.body;

    const product = await s_and_f.findOne({
      _id: productId,
      "seller.farmer": farmerId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.stockAvailable = false;
    product.isFeatured = false;

    await product.save();

    res.json({
      success: true,
      message: "Product removed successfully",
      product,
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// GET ALL PRODUCTS
// =======================
const getAllSeedFertiliserProducts = async (req, res) => {
  try {
    let {
      category,
      brand,
      isOrganic,
      weight,
      weightUnit,
      discount,
      sortBy,
      order,
      page,
      limit,
    } = req.query;

    const Page = Number(page) || 1;
    const Limit = Number(limit) || 10;
    const skip = (Page - 1) * Limit;
    order = order === "asc" ? 1 : -1;

    let pipeline = [];

    // ---------------- FILTER ----------------
    let matchStage = {};

    if (category) matchStage.category = category;
    if (brand) matchStage.brand = brand;
    if (isOrganic !== undefined) matchStage.isOrganic = isOrganic === "true";
    if (weight) matchStage.weight = Number(weight);
    if (weightUnit) matchStage.weightUnit = weightUnit;
    if (discount !== undefined)
      matchStage.discount = { $gte: Number(discount) };

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const totalCount = await s_and_f.countDocuments(matchStage);
    const totalPages = Math.ceil(totalCount / Limit);

    // ---------------- JOIN FARMER ----------------
    pipeline.push({
      $lookup: {
        from: "farmers",
        localField: "seller.farmer",
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

    // ---------------- SORT ----------------
    let sortField = "createdAt";
    if (sortBy === "price") sortField = "price";
    else if (sortBy === "rating") sortField = "rating";
    else if (sortBy === "weight") sortField = "weight";

    pipeline.push({ $sort: { [sortField]: order } });

    // ---------------- PAGINATION ----------------
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Limit });

    // ---------------- FINAL SHAPE ----------------
    pipeline.push({
      $project: {
        name: 1,
        category: 1,
        brand: 1,
        isOrganic: 1,
        weight: 1,
        weightUnit: 1,
        discount: 1,
        price: 1,
        rating: 1,
        stockAvailable: 1,
        image: 1,

        // 🔥 CHAT ADDED
        chat: 1,

        farmer: {
          fullName: "$farmer.fullName",
          location: "$farmer.gpsLocation",
        },

        createdAt: 1,
      },
    });

    const result = await s_and_f.aggregate(pipeline);

    res.json({
      success: true,
      products: result,
      totalCount,
      totalPages,
      currentPage: Page,
      count: result.length,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  sellSeedAndFertiliser,
  QuantityManipulator,
  updatePriceAndDisOfSeedAndFertiliser,
  buySeedAndFertiliser,
  removeProduct,
  getAllSeedFertiliserProducts,
};
// https://copilot.microsoft.com/chats/bc7ZohwfgXWYuf5LHaTJz
