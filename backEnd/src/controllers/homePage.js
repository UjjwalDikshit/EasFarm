// https://chatgpt.com/share/68a20036-fce0-8007-9e6c-3c32e7c76de9

const homeSchema = require("../models/homeSchema");

const homepage = async (req, res) => {
  try {
    const home = await homeSchema.findOne();

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "No homepage data found",
      });
    }

    return res.status(200).json({
      success: true,
      home: {
        banners: home.banners || [],
        categories: home.categories || [],
      },
    });

  } catch (err) {
    console.error("homepage error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch homepage data",
    });
  }
};

module.exports = homepage;


/*
    [
        { title: 'Welcome', content: 'This is the home page.' },
        { title: 'About Us', content: 'Learn more about our company.' }
    ]

    // object from returning will look like this

    const originalHomepageInput = {
    banners: [
        {
            title1: "Featured Products",
            image: "https://example.com/images/banner1.jpg",
            link: "/products/featured"
        },
        {
            title1: "Summer Sale",
            image: "https://example.com/images/sale.png",
            link: "/promotions/summer-sale"
        }
    ],
    categories: [
        {
            name: "Electronics",
            icon: "https://example.com/icons/electronics.svg",
            link: "/shop/electronics"
        },
        {
            name: "Books",
            icon: "https://example.com/icons/books.svg",
            link: "/shop/books"
        },
        {
            name: "Apparel",
            icon: "https://example.com/icons/apparel.svg",
            link: "/shop/apparel"
        }
    ]
};

// This object can then be used to create a new document:
// const newHomepage = new homeSchema(originalHomepageInput);
// await newHomepage.save();
*/