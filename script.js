$(document).ready(function(){

    let BASE_URL = "https://api.coingecko.com/api/v3";

    let COINS_DATA_PAGE1_ENDPOINT = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

    let coinsDataPage1url = BASE_URL + COINS_DATA_PAGE1_ENDPOINT; 

    fetch(coinsDataPage1url)
    .then(function(res){
        res.json().then(function(data){
            console.log(data)
            // $("#largeIntroTextField").html
        });
 

    });

    



});