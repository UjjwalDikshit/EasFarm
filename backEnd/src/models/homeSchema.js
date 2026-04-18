const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    banners: [
        {
            title: String,
            link: String,
            image: {
                url: String,
                public_id: String
            }
        }
    ],

    categories: [
        {
            name: String,
            link: String,
            icon: {
                url: String,
                public_id: String
            }
        }
    ]
});

module.exports = mongoose.model("Home", homeSchema);
/*

title = what text user sees.
image = what picture is shown.
link = where user goes when clicked.


making schma to want admin control on home page.

If data is static → keep JSON file or hardcode in backend.
If data is dynamic (admin can change banners/categories) → make a schema.
 */