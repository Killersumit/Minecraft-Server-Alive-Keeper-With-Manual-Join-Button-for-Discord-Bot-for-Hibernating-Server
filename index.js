const express = require("express");
const mineflayer = require("mineflayer");

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET_KEY;

const MC_HOST = process.env.MC_HOST;
const MC_PORT = parseInt(process.env.MC_PORT);
const MC_VERSION = process.env.MC_VERSION;

app.get("/", (req, res) => {
  res.send("☕ Chai Wale Wake Service Running");
});

app.post("/wake", async (req, res) => {

  const auth = req.headers.authorization;

  if (auth !== SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {

    const bot = mineflayer.createBot({
      host: MC_HOST,
      port: MC_PORT,
      username: "WakeBot_" + Math.floor(Math.random() * 1000),
      version: MC_VERSION
    });

    bot.once("login", () => {
      console.log("✅ Login packet sent - server should wake");
      setTimeout(() => bot.quit(), 3000);
    });

    bot.on("error", (err) => {
      console.log("Wake error:", err.message);
    });

    res.json({ success: true, message: "Wake attempt sent" });

  } catch (err) {
    res.status(500).json({ error: "Wake failed" });
  }

});

app.listen(PORT, () => {
  console.log(`🚀 Wake Service running on port ${PORT}`);
});
