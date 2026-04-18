const homeSchema = require("../models/homeSchema");
const deleteFromCloudinary = require("../cloudinary/services/cloudinary.delete.service");

const addBanner = async (req, res) => {
  try {
    const { title, link, image } = req.body;

    if (!image?.url || !image?.public_id) {
      return res.status(400).send("Image required");
    }

    const updated = await homeSchema.findOneAndUpdate(
      {},
      {
        $push: {
          banners: { title, link, image },
        },
      },
      { new: true, upsert: true },
    );

    return res.status(200).send({
      message: "Banner added",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to add banner");
  }
};

const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { title, link, image } = req.body;

    const home = await homeSchema.findOne();

    const banner = home.banners.id(bannerId);

    if (!banner) {
      return res.status(404).send("Banner not found");
    }

    //  If new image → delete old one
    if (image?.public_id && image.public_id !== banner.image.public_id) {
      await deleteFromCloudinary(banner.image.public_id);
      banner.image = image;
    }

    banner.title = title || banner.title;
    banner.link = link || banner.link;

    await home.save();

    return res.status(200).send({
      message: "Banner updated",
      data: home,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to update banner");
  }
};
const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;

    const home = await homeSchema.findOne();

    if (!home) {
      return res.status(404).send("Home document not found");
    }

    const banner = home.banners.id(bannerId);

    if (!banner) {
      return res.status(404).send("Banner not found");
    }

    //  HANDLE OLD + NEW IMAGE STRUCTURE
    const image = banner.image;

    let publicId = null;

    // NEW SCHEMA
    if (typeof image === "object" && image?.public_id) {
      publicId = image.public_id;
    }

    // OLD SCHEMA → image is string URL (no Cloudinary tracking)
    // so we skip deletion safely

    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    // remove banner
    banner.deleteOne();
    await home.save();

    return res.status(200).send({
      message: "Banner deleted successfully",
      data: home,
    });

  } catch (err) {
    console.error("Delete Banner Error:", err);
    return res.status(500).send("Failed to delete banner");
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, link, icon } = req.body;

    if (!icon?.url || !icon?.public_id) {
      return res.status(400).send("Icon required");
    }

    const updated = await homeSchema.findOneAndUpdate(
      {},
      {
        $push: {
          categories: { name, link, icon },
        },
      },
      { new: true, upsert: true },
    );

    return res.status(200).send({
      message: "Category added",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to add category");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, link, icon } = req.body;

    const home = await homeSchema.findOne();

    const category = home.categories.id(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    //  Replace icon if new one
    if (icon?.public_id && icon.public_id !== category.icon.public_id) {
      await deleteFromCloudinary(category.icon.public_id);
      category.icon = icon;
    }

    category.name = name || category.name;
    category.link = link || category.link;

    await home.save();

    return res.status(200).send({
      message: "Category updated",
      data: home,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to update category");
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const home = await homeSchema.findOne();

    if (!home) {
      return res.status(404).send("Home document not found");
    }

    const category = home.categories.id(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    //HANDLE OLD + NEW SCHEMA SAFELY
    const icon = category.icon;

    let publicId = null;

    // NEW SCHEMA
    if (typeof icon === "object" && icon?.public_id) {
      publicId = icon.public_id;
    }

    // OLD SCHEMA (string URL) → no cloudinary delete needed
    // (because no public_id exists)
    // else publicId stays null

    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    // remove from array
    category.deleteOne();
    await home.save();

    return res.status(200).send({
      message: "Category deleted successfully",
      data: home,
    });

  } catch (err) {
    console.error("Delete Category Error:", err);
    return res.status(500).send("Failed to delete category");
  }
};

const createHome = async (req, res) => {
  try {
    const existing = await homeSchema.findOne();

    if (existing) {
      return res.status(400).send({
        message: "Home already exists",
      });
    }

    const newDoc = await homeSchema.create({
      banners: [],
      categories: [],
      ...req.body, // optional future fields
    });

    return res.status(201).send({
      message: "Homepage created successfully",
      data: newDoc,
    });
  } catch (err) {
    console.error("Create Home Error:", err);
    return res.status(500).send({
      message: "Failed to create homepage",
    });
  }
};

const getHome = async (req, res) => {
  try {
    const home = await homeSchema.findOne();

    if (!home) {
      return res.status(404).send({
        message: "Home not found",
      });
    }

    return res.status(200).json({
      success: true,
      home,
    });

  } catch (err) {
    console.error("Get Home Error:", err);
    return res.status(500).send({
      message: "Failed to fetch homepage",
    });
  }
};

module.exports = {
  // HOME
  createHome,
  getHome,

  // BANNERS
  addBanner,
  updateBanner,
  deleteBanner,

  // CATEGORIES
  addCategory,
  updateCategory,
  deleteCategory,
};
/*https://g.co/gemini/share/d1d5f8324ea0 */
//https://gemini.google.com/app/26a7c8cb8749eabf // to get total chatbox
