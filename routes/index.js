var express = require('express');
let path = require('path'),
  hotelQueryAPIManager = require(path.resolve('./managers/hotelQueryAPIManager')),
  router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let princeInfo = await hotelQueryAPIManager.getHotelPrice(query);
    res.status(princeInfo.status).send(princeInfo);
  } catch (error){
    res.status(error.status).send(error.error);
  }
}

module.exports = {
  router : router,
  endpoint : 'api/hotel'
};
