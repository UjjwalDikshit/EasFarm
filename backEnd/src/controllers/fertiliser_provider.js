const { s_and_f } = require("../models/seedsFertiliser");
const farmer = require("../models/farmerSchema");
const cloudinary = require("../cloudinary/config/cloudinary");

// =======================
// SELL SEED / FERTILISER
// =======================
const sellSeedAndFertiliser = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      imageUrl,
      public_id,
    } = req.body;

    const farmerId = req.user._id;

    if (!name || !category || !brand || !price || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const farmerData = await farmer.findById(farmerId);

    const product = await s_and_f.create({
      ...req.body,

      //  FIX IMAGE
      image: {
        url: imageUrl,
        public_id: public_id,
      },

      seller: {
        name: farmerData.fullName,
        contact: farmerData.mobileNumber,
        farmer: farmerData._id,
      },

      chat: farmerData.chat,
    });

    res.status(201).json({
      success: true,
      message: "Product registered successfully",
      product,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
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

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await s_and_f.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    Object.assign(product, updates);

    await product.save();

    res.json({
      success: true,
      message: "Product updated",
      product,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
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
    const {productId } = req.body;
    const farmerId = req.user._id;
    const product = await s_and_f.findOne({
      _id: productId,
      "seller.farmer": farmerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //  DELETE IMAGE FROM CLOUDINARY
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await s_and_f.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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
      sort,
      order,
      search,
      page,
      limit,
    } = req.query;

    const Page = Math.max(1, Number(page) || 1);
    const Limit = Math.max(1, Number(limit) || 10);
    const skip = (Page - 1) * Limit;

    // ================= FILTER =================
    let matchStage = {};

    if (category) matchStage.category = category;

    if (brand) {
      matchStage.brand = { $regex: brand, $options: "i" };
    }

    if (isOrganic !== undefined && isOrganic !== "") {
      matchStage.isOrganic = isOrganic === "true";
    }

    if (weight) matchStage.weight = Number(weight);

    if (weightUnit) matchStage.weightUnit = weightUnit;

    if (discount !== undefined && discount !== "") {
      matchStage.discount = { $gte: Number(discount) };
    }

    // 🔍 SEARCH (name + brand)
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // ================= SORT =================
    let sortStage = { createdAt: -1 }; // default

    if (sort) {
      switch (sort) {
        case "price-asc":
          sortStage = { price: 1 };
          break;
        case "price-desc":
          sortStage = { price: -1 };
          break;
        case "rating-desc":
          sortStage = { rating: -1 };
          break;
        case "newest":
          sortStage = { createdAt: -1 };
          break;
        default:
          sortStage = { createdAt: -1 };
      }
    }

    // ================= PIPELINE =================
    const pipeline = [
      { $match: matchStage },

      {
        $facet: {
          metadata: [{ $count: "total" }],

          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: Limit },

            {
              $lookup: {
                from: "farmers",
                localField: "seller.farmer",
                foreignField: "_id",
                as: "farmer",
              },
            },
            {
              $unwind: {
                path: "$farmer",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
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
                chat: 1,
                seller: 1,

                farmer: {
                  fullName: "$farmer.fullName",
                  location: "$farmer.gpsLocation",
                },

                createdAt: 1,
              },
            },
          ],
        },
      },
    ];

    const [result] = await s_and_f.aggregate(pipeline);

    const totalCount = result.metadata[0]?.total || 0;
    const products = result.data;
    const totalPages = Math.ceil(totalCount / Limit);

    return res.json({
      success: true,
      products,
      totalCount,
      totalPages,
      currentPage: Page,
      count: products.length,
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMySeedAndFertiliser = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const products = await s_and_f.find({
      "seller.farmer": farmerId,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "My products fetched successfully",
      products,
    });

  } catch (err) {
    console.error("Error fetching my products:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: err.message,
    });
  }
};


module.exports = {
  sellSeedAndFertiliser,
  QuantityManipulator,
  updatePriceAndDisOfSeedAndFertiliser,
  buySeedAndFertiliser,
  removeProduct,
  getAllSeedFertiliserProducts,
  getMySeedAndFertiliser,
  updateProduct,
};
// https://copilot.microsoft.com/chats/bc7ZohwfgXWYuf5LHaTJz
