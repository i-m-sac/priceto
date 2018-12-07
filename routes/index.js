var express = require('express');
let path = require('path'),
    HotelQueryAPIManager = require(path.resolve('./managers/hotelQueryAPIManager')),
    hotelQueryAPIManager = new HotelQueryAPIManager(),
    router = express.Router();

router.post('/', async(req, res) => {
    try {
        let princeInfo = await hotelQueryAPIManager.getHotelPrice(req.body);
        res.status(princeInfo.status).send(princeInfo);
    } catch (error){
        res.status(error.status || '400').send(error.error);
    }
});

module.exports = {
    router : router,
    endpoint : '/api/hotel'
};
