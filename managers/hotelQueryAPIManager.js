let path = require('path'),
    hotelQueryAPIService = require(path.resolve('./services/hotelQueryAPIService'));

class HotelQueryAPIService{
    async getHotelPrice(query){
        try{
            let queryObj = {
                fromDate : query.params.fromDate,
                toDate : query.params.toDate,
                name : query.params.name
            };
            let priceInfo = await hotelQueryAPIService.getHotelPrice(queryObj);
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