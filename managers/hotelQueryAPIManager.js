let path = require('path'),
    HotelQueryAPIService = require(path.resolve('./services/hotelQueryAPIService')),
    hotelQueryAPIService = new HotelQueryAPIService();


class HotelQueryAPIManager{
    /**
     * Function to get hotel price by invoking service layer
     * @param reqBody {Object}
     * @returns {Promise<{status: number, data}>}
     */
    async getHotelPrice(reqBody){
        try{
            let priceInfo = await hotelQueryAPIService.getHotelPricing(reqBody);
            return ({
                status : 200,
                data : priceInfo
            });
        } catch(error){ 
            throw({
                status: 404,
                error : error
            });
        }
    }
}

module.exports = HotelQueryAPIManager;