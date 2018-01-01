let path = require('path'),
    rp = require('request-promise'),
    moment = require('moment'),
    hotelQueryURL = "https://www.google.com/search?q=@hotelName@&ahotel_dates=@checkInDate@%2C@duration@#ahotel_dates=@checkOutDate@,@duration@";

class HotelQueryAPIService{
    async getHotelPricing(query){
        try{
            let parsedURL = this.createHotelPricingURL(query);
            let response  = await rp(parsedURL)
                console.log(response);
            return response;    
        } catch (error) {
            throw error;
        } 
 }

    createHotelPricingURL(query){
        let regex = /[.,]/g;
        query.hotelName = query.hotelName.replace(regex, "");
        let checkOutDate = moment(query.checkInDate).add(query.duration, 'days');
        let url = hotelQueryURL.replace('@hotelNameAndAddress@', query.hotetName)
            .replace(' ', '%20')
            .replace('@checkInDate@', query.checkInDate)
            .replace('@checkOutDate@', checkOutDate)
            .replace(/@duration@/g, query.duration);
            console.log(url);
        return url;
    }
}