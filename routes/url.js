const express=require('express');
const { handleGenerateNewShortUrl, handleShowQrCode,handleDeleteUrl,handleGetAnalytics } = require('../controllers/url');
const router=express.Router();


router.post("/",handleGenerateNewShortUrl);
router.get("/analytics/:shortid",handleGetAnalytics);
router.post("/delete/:shortid", handleDeleteUrl);
router.get("/qrcode/:shortid", handleShowQrCode);
module.exports=router;
