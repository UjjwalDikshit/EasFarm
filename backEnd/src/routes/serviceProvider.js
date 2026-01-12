const express = require('express');
const router = express.Router();
const validUser = require('../middlewares/validUser');
const validSurviceProvider = require('../middlewares/validSurviceProvider.js');
const  {register,registerTools,getSpecificProviderTools, getAllTools}= require('../controllers/service_provider.js');
const {sellSeedAndFertiliser , QuantityManipulator,updatePriceAndDisOfSeedAndFertiliser,buySeedAndFertiliser,removeProduct,getAllSeedFertiliserProducts} = require('../controllers/fertiliser_provider.js')

router.post('/provider/register',register);
router.post('/tools/register',validSurviceProvider,registerTools);
router.get('/specific-provider/tools/:providerId',validUser,getSpecificProviderTools);
router.get('/get-all-tools',getAllTools);



router.post("/sell", sellSeedAndFertiliser);
router.post('/quantity-manipulate',QuantityManipulator);
router.put("/product/:productId/price-discount", updatePriceAndDisOfSeedAndFertiliser);
router.post("/buy", buySeedAndFertiliser);
router.post("/remove", removeProduct);
router.get("/getAllproduct",getAllSeedFertiliserProducts);


module.exports = router;

// sell ka minmimum input vs optional
/* 
  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ │
  │ {
  │   "name": "Organic Wheat Seed",│
  │   "category": "Seed",
  │   "brand": "AgriGrow",
  │   "price": 1200,
  │   "seller": {│
  │     "serviceProvider": "66c7489b6d8c7e21f3fbd123"  │   }│
  │ }│
  │ │
  │ │
  │ {│
  │   "name": "Urea Fertiliser",│
  │   "category": "Fertiliser",│
  │   "brand": "GreenFarm",│
  │   "manufacturer": "Green Chemicals Ltd",│
  │   "batchNumber": "UF12345",│
  │   "certification": "ISO 9001",│
  │   "isOrganic": false,  │   "description": "High-quality urea for healthy crop growth.",│
  │   "image": "https://example.com/images/urea.png",│
  │   "weightUnit": "kg",│
  │   "weight": 50,│
  │   "packagingType": "Bag",│
  │   "price": 850,│
  │   "discount": 10,│
  │   "stockQuantity": 500,│
  │   "currency": "INR",│
  │   "manufactureDate": "2024-07-10",│
  │   "expiryDate": "2026-07-10",│
  │   "storageInstructions": "Keep in a dry place.",│
  │   "usageInstructions": "Apply evenly to soil.",│
  │   "safetyInfo": "Avoid contact with eyes.",│
  │   "seller": {│
  │     "serviceProvider": "66c7489b6d8c7e21f3fbd123"│
  │   },│
  │   "isFeatured": true│
  │ }│
  │                                                                                                                    │
  └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
 */

//   {
//   "productId": "66c7489b6d8c7e21f3fbd123", // required: the product's ObjectId
//   "quantity": 5                           // required: number of units to purchase
//   // no optional fields here, only these two are needed
// }


// 



// input for buy

// {
//   "farmerId": "66c7489b6d8c7e21f3fbd111",   // required: farmer's ObjectId
//   "productId": "66c7489b6d8c7e21f3fbd222",  // required: product's ObjectId
//   "quantity": 2,                            // required: number of units to buy
//   "finalPrice": 2400                        // required: total price after discount
//   // optional fields: none
// }

// input for price and discount change
// {
//   "price": 1500,       // optional: update only if you want to change price
//   "discount": 10       // optional: update only if you want to change discount
// }

// PUT http://localhost:5000/api/product/66c7489b6d8c7e21f3fbd222/price-discount


// request body for input

// {
//   "providerId": "66c7489b6d8c7e21f3fbd555",  // required: service provider's ObjectId
//   "productId": "66c7489b6d8c7e21f3fbd999"    // required: product's ObjectId
// }
