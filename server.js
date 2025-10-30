const express = require("express");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ✅ Home page — make sure to define `error`
app.get("/", (req, res) => {
  res.render("index", { qrImage: null, inputText: "", error: null, size: 300 });
});

// ✅ Generate QR
app.post("/generate", async (req, res) => {
  const text = req.body.text?.trim();
  const size = parseInt(req.body.size) || 300;

  if (!text) {
    return res.render("index", { qrImage: null, inputText: "", error: "Please enter text or URL", size });
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(text, { width: size });
    res.render("index", { qrImage: qrDataUrl, inputText: text, error: null, size });
  } catch (err) {
    res.render("index", { qrImage: null, inputText: text, error: "Error generating QR", size });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 QR Generator running at http://localhost:${PORT}`);
});
