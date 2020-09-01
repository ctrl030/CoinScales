$(document).ready(function(){


    



    
    let BASE_URL = "https://api.coingecko.com/api/v3";

    let COINS_DATA_PAGE1_ENDPOINT = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

    let coinsDataPage1url = BASE_URL + COINS_DATA_PAGE1_ENDPOINT; 

    fetch(coinsDataPage1url)
    .then(function(res){
        res.json().then(function(data){
            
            const usdFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumSignificantDigits: 20,
            })


            console.log("All:")
            console.log(data)
            console.log("First Coin: ")
            console.log(data[0])
            
            console.log("First Coin, rank: ")
            console.log("1.")
            
            console.log("First Coin, name: ")
            console.log(data[0].name)
            
            console.log("First Coin, Market Cap: " + usdFormatter.format(data[0].market_cap))
            console.log(data[0].market_cap)

            console.log("First Coin, price: " + usdFormatter.format(data[0].current_price))
            console.log(data[0].current_price)
         
            console.log("First Coin,  24 Hour Volume : " + usdFormatter.format(data[0].total_volume))
            console.log(data[0].total_volume)

            console.log("First Coin, Circ. Supply: ")
            console.log(data[0].circulating_supply)
 

            console.log("First Coin, Change last 24 hours in Percent: ")
            let percentPriceChange = (Number(data[0].price_change_percentage_24h/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))
            console.log
            if (percentPriceChange > 0){
                $("#XXXXXXXXXXX").addClass("greenText")
            } else {
                $("#XXXXXXXXXXX").addClass("redText")
            };   

 
            console.log("First Coin, Price Graph: ")
            console.log(data[0].name)
 
            console.log("Dot Dot Dot")
          

        let testObjectArray =  [{name: "ArrayCoin1", price:"100", priceChange: "1,1"}, {name: "ArrayCoin2", price:"200", priceChange: "2,2"}, {name: "ArrayCoin2", price:"200", priceChange: "2,2"}]


        for (let i = 0; i < data.length; i++) {
            console.log(i)
            $("#tableBody").append(
            `
            <tr>
                <td scope="col">${i + 1}</td>
                <td scope="col">${data[i].name}</td>
                <td scope="col">${data[i].market_cap}</td>
                
                <td scope="col">${data[i].current_price}</td>
                <td scope="col">${data[i].total_volume}</td>
                <td scope="col">${data[i].circulating_supply}</td>
                
                <td class="priceChangePercentage" scope="col">${(Number(data[i].price_change_percentage_24h/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))}</td>
                <td scope="col">Graph Placeholder</td>
                <td scope="col">...</td>
            </tr>
            `
            );
        }


        // $("#largeIntroTextField").html

                  
                         
                   
                    
                   
                       
                    
                      
                  
                        
                   
                        
                   
                        





        });
 

    });
     
    



});