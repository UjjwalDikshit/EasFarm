const cron = require("node-cron");
const Blog = require("../models/blog");

const startTrendingDecay = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("⏳ Running trending decay...");

    try {
      await Blog.updateMany(
        { status: "published" },
        { $mul: { trendingScore: 0.97 } }
      );

      console.log("✅ Trending decay done");
    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};

// https://chatgpt.com/g/g-p-68b9cdeee6648191b09c4aff4e47cac8/c/6979fed4-3fcc-8323-81d1-6cdb015f94a3 read about cron

module.exports = startTrendingDecay;
