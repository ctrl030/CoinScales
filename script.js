$(document).ready(function () {
  let pageCounter = 1;
  /*
  let urlPartOne = "coinsDataPage" ;
  let urlPartTwo = pageCounter;
  let urlPartThree = "url";
  */
  
  
  
  let BASE_URL = "https://api.coingecko.com/api/v3";

  let COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
  
  /*
  let COINS_DATA_PAGE2_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=2&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE3_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=3&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE4_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=4&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE5_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=5&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE6_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=6&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE7_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=7&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE8_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=8&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE9_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=9&sparkline=false&price_change_percentage=24h&sparkline=true";
  let COINS_DATA_PAGE10_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=10&sparkline=false&price_change_percentage=24h&sparkline=true";
  

  let coinsDataPage1url = BASE_URL + COINS_DATA_PAGE1_ENDPOINT;
  let coinsDataPage2url = BASE_URL + COINS_DATA_PAGE2_ENDPOINT;
  let coinsDataPage3url = BASE_URL + COINS_DATA_PAGE3_ENDPOINT;
  let coinsDataPage4url = BASE_URL + COINS_DATA_PAGE4_ENDPOINT;
  let coinsDataPage5url = BASE_URL + COINS_DATA_PAGE5_ENDPOINT;
  let coinsDataPage6url = BASE_URL + COINS_DATA_PAGE6_ENDPOINT;
  let coinsDataPage7url = BASE_URL + COINS_DATA_PAGE7_ENDPOINT;
  let coinsDataPage8url = BASE_URL + COINS_DATA_PAGE8_ENDPOINT;
  let coinsDataPage9url = BASE_URL + COINS_DATA_PAGE9_ENDPOINT;
  let coinsDataPage10url = BASE_URL + COINS_DATA_PAGE10_ENDPOINT;
  

  let pageToFetch =  eval((urlPartOne.concat(urlPartTwo)).concat(urlPartThree));
  */
  
 let pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;

  function loadCorrectPage () {
    // urlPartTwo = pageCounter;
    COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
    pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;
    // pageToFetch =  eval((urlPartOne.concat(urlPartTwo)).concat(urlPartThree));
  };

  console.log(pageToFetch);
  
  $("#lastPageButton").hide();

  loadCorrectPage();

  tableBuildingFunction();

  $("#nextPageButton").click(function(){
      
    pageCounter += 1;
    $("#tableBody").empty(); 

    if (pageCounter >1) {
      $("#lastPageButton").show();
      }
    
    if (pageCounter >=10) {
      pageCounter = 10;
      $("#nextPageButton").hide();
    }
    loadCorrectPage();    
    tableBuildingFunction();

  });

  $("#lastPageButton").click(function(){

    pageCounter -= 1;
    $("#tableBody").empty(); 

    if (pageCounter <10) {
      $("#nextPageButton").show();
      }
    if (pageCounter <= 1) {
      pageCounter = 1;
      $("#lastPageButton").hide();
    }

    console.log(pageCounter);
    pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;
    // pageToFetch =  eval((urlPartOne.concat(urlPartTwo)).concat(urlPartThree));
    console.log("pageToFetch: " + pageToFetch);
    tableBuildingFunction();
  });

  function tableBuildingFunction () {
    loadCorrectPage();
    // $("#tableBody") = [];

    /*
    console.log("global Pagecounter is : " + pageCounter);
    pageToFetch = eval((urlPartOne.concat(urlPartTwo)).concat(urlPartThree));
    console.log("pageToFetch at beginning of tableBuildingFunction: " + pageToFetch); 
    console.log("urlPartTwo at beginning of tableBuildingFunction: " + urlPartTwo); 
    */

    fetch(pageToFetch).then(function (res) {
      pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;
      // pageToFetch = eval((urlPartOne.concat(urlPartTwo)).concat(urlPartThree));
      res.json().then(function (data) {
        const usdFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumSignificantDigits: 20,  
        });



        const simpleNumberFormatter = new Intl.NumberFormat("en-US", {
          maximumSignificantDigits: 20,
          maximumFractionDigits: 0,
        });


      

        console.log(data);

        for (let i = 0; i < data.length; i++) {
          const percentPriceChange = Number(data[i].price_change_percentage_24h / 100);
                
          //To change the color of the 24h price change in percent
          let priceColor = "blackText";
          if (percentPriceChange > 0) {
            priceColor = "greenText";
          } else {
            priceColor = "redText";
          };

          // To get the right formatting for the 24h price change in percent
          const percentPriceChangeFormatted = Number(data[i].price_change_percentage_24h / 100).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          });

          
          //To generate the market data table rows and append them to the existing html table
          $("#tableBody").append(
            `
              <tr>
                <td scope="col">${(i + 1) + ((100*pageCounter)-100)}</td>              
                <td scope="col"><img class="iconSpacing my" src="${data[i].image}"></img><b>${data[i].name}</b></td>
                <td scope="col" class="textAllignRight">${usdFormatter.format(data[i].market_cap)}</td>
                                          
                <td scope="col" class="textAllignRight">${usdFormatter.format(data[i].current_price)}</td>
                <td scope="col" class="textAllignRight">${usdFormatter.format(data[i].total_volume)}</td>
                
                <td scope="col" class="textAllignRight"> ${simpleNumberFormatter.format(Math.round(data[i].circulating_supply))} ${(data[i].symbol.toUpperCase())}</td>
                                          
                <td class="priceChangePercentage ${priceColor} textAllignRight" scope="col">${percentPriceChangeFormatted}</td>
                <td scope="col" id="placeholder${i}">  </td>
                <td scope="col">...</td>
              </tr>
            `
          );

          $("#placeholder"+i).sparkline(data[i].sparkline_in_7d.price, {
            type: 'line',
            width: '165px',
            height: '50px',
            lineColor: '#edc240',
            fillColor: '#ffffff',
            lineWidth: 2,
            spotColor: undefined,
            minSpotColor: undefined,
            maxSpotColor: undefined,
            highlightSpotColor: undefined,
            highlightLineColor: undefined,
            spotRadius: 0,
            disableInteraction: true,
            });


        };

      });
      
    });
  };
});
