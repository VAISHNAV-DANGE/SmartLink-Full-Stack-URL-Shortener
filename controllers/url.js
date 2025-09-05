
const qrcode = require('qrcode');
const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  try {
    const body = req.body;
    const allurls = await URL.find({ createdBy: req.user._id });

    if (!body || !body.url) {
      // Re-render the page with an error
      return res.render("home", {
        urls: allurls,
        error: "URL is a required field.",
      });
    }
    // URL validation using a regular expression
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    if (!urlPattern.test(body.url)) {
      return res.render("home", {
        urls: allurls,
        error: "Please enter a valid URL.",
      });
    }
    let expireAt;
    const expiration = body.expiration; 

    if (expiration && expiration !== "never") {
      const now = new Date();
      switch (expiration) {
        case "1-hour":
          expireAt = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case "1-day":
          expireAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "7-days":
          expireAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    const shortid = nanoid(8);

    await URL.create({
      shortid: shortid,
      redirectUrl: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });
    if (expireAt) {
      newUrlData.expireAt = expireAt;
    }
    const updatedUrls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
      urls: updatedUrls,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
      urls: allurls,
      error: "Internal server error. Please try again later.",
    });
  }
}
async function handleGetAnalytics(req, res) {
  try {
    const shortid = req.params.shortid;


    const result = await URL.findOne({ shortid });

    // Handle case when shortid doesn't exist
    if (!result) {
      return res.status(404).json({
        error: "Short URL not found",
      });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function redirectToUrl(req, res) {
  try {
    const shortid = req.params.shortid;
    const entry = await URL.findOneAndUpdate(
      { shortid },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
async function handleDeleteUrl(req, res) {
  try {
    const shortid = req.params.shortid;
    const userId = req.user._id;
    const result = await URL.deleteOne({
      shortid: shortid,
      createdBy: userId,
    });

    if (result.deletedCount === 0) {
      return res.redirect("/");
    }

    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.redirect("/");
  }
}
async function handleShowQrCode(req, res) {
  try {
    const shortid = req.params.shortid;
    // Construct the full URL dynamically
    const fullShortUrl = `${req.protocol}://${req.get("host")}/${shortid}`;

    // Generate the QR code as a "data URL" (a base64 encoded string)
    const qrCodeImage = await qrcode.toDataURL(fullShortUrl);
    res.render("qrcode", { qrCodeImage: qrCodeImage });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Could not generate QR code.");
  }
}
module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
  redirectToUrl,
  handleDeleteUrl,
  handleShowQrCode,
};
