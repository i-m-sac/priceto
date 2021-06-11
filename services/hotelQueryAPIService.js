let path = require('path'),
    rp = require('request-promise'),
    moment = require('moment'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    hotelQueryURL = "https://www.google.com/search?q=@hotelName@&ahotel_dates=@checkInDate@%2C@duration@#ahotel_dates=@checkOutDate@,@duration@";

class HotelQueryAPIService{
    /**
     * Function to get hotel pricing by querying google
     * @param query {Object}
     * @returns {Promise}
     */
    async getHotelPricing(query){
        try{
            let self = this;
            let parsedURL = self.createHotelPricingURL(query);
            let html = await self.fetchDataFromURL(parsedURL);
            return self.parseURLDataForHotelPrices(html, query);
        } catch (error) {
            console.log('Error', error);
            throw error;
        } 
    }

    /**
     *
     * Function to perform get API request
     * @param url {String}
     * @returns {Promise}
     */
    async fetchDataFromURL(url){
        let options = {
            uri : url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36'
            }
        }
        return await rp(options);
    }

    /**
     * Function to parse HTML data from google search results
     * @param html {String}
     * @param query {Object}
     * @returns {Promise<Array>}
     */
    async parseURLDataForHotelPrices(html, query){
        try{
            // let $ = cheerio.load(fs.readFileSync(path.resolve('./google.htm'))), //Test File
            let $ = cheerio.load(html),
                hotelModule = $('.lhbm-partner-rates'),
                hotelRateInfo = [];
            if (hotelModule && hotelModule.length && hotelModule[0].children && hotelModule[0].children[0].children){
                let counter = 0;
                hotelModule[0].children[0].children.forEach( childElement => {
                    let rateInfo = {};
                    if(childElement.children[0] && childElement.children[0].children[0].attribs['data-dp']){
                        rateInfo.id = counter++;
                        rateInfo.pricePerNight = childElement.children[0].children[0].attribs['data-dp'];
                        let pricePerNight = rateInfo.pricePerNight.match(/\d+/gm)
                        pricePerNight = parseInt(pricePerNight.join(''))
                        rateInfo.totalPrice = "₹" + pricePerNight * query.duration;
                        rateInfo.siteName = childElement.children[0].children[0].children[1].children[2].children[0].children[0].data;
                        rateInfo.siteURL = childElement.children[0].children[0].attribs['href'];
                        hotelRateInfo.push(rateInfo);
                    }
                    else {
                        let tempElement = childElement.children[0] ? childElement.children[0].children[0] : undefined;
                        if(tempElement && tempElement.children[0].name === 'g-expandable-container'){
                            tempElement = tempElement.children[0].children[0].children[0];
                            tempElement.children.forEach( subChildElement => {
                                if(subChildElement.children[0].attribs['data-dp']){
                                    rateInfo = {};
                                    rateInfo.id = counter++;
                                    rateInfo.pricePerNight = subChildElement.children[0].attribs['data-dp'];
                                    let pricePerNight = rateInfo.pricePerNight.match(/\d+/gm)
                                    pricePerNight = parseInt(pricePerNight.join(''))
                                    rateInfo.totalPrice = "₹" + pricePerNight * query.duration;
                                    rateInfo.siteName = subChildElement.children[0].children[1].children[2].children[0].children[0].data;
                                    rateInfo.siteURL = subChildElement.children[0].attribs['href'];
                                    hotelRateInfo.push(rateInfo);
                                }
                            });
                        }
                    }
                });
                return hotelRateInfo;
            }
            else {
                return "Hotel Rates Not Available";
            }
        } catch(e){
            console.log(e);
        }
        
    }

    /**
     * Function to construct url to query google from user query object
     * @param query {Object}
     * @returns {string}
     */
    createHotelPricingURL(query){
        let regex = /[.,]/g;
        try{
            query.hotelName = query.hotelName.replace(regex, "");
            let checkOutDate = moment(query.checkInDate, "YYYY-MM-DD").add(query.duration, 'days').format('YYYY-MM-DD');
            console.log('CHeckOut', checkOutDate);
            let url = hotelQueryURL.replace('@hotelName@', query.hotelName)
                .replace(/ /g, '%20')
                .replace('@checkInDate@', query.checkInDate)
                .replace('@checkOutDate@', checkOutDate)
                .replace(/@duration@/g, query.duration);
                console.log(url);
            return url;
        } catch(error){
            console.log('Error in constructing URL', error);
            throw error;
        }
        
    }
}

module.exports = HotelQueryAPIService;