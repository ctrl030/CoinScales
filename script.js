$(document).ready(function () {
  let pageCounter = 1;
  
  let BASE_URL = "https://api.coingecko.com/api/v3";

  let FIRST_ROW_ENDPOINT = "/global";
  
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 5, 
    minimumSignificantDigits: 3, 
  });

  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 20, 
    minimumSignificantDigits: 2, 
  });

  const simpleNumberFormatter = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 20,
    maximumFractionDigits: 0,
  });

  
  // let wholeMarketCap = 0;


  let firstRowUrl = BASE_URL + FIRST_ROW_ENDPOINT;
  fetch(firstRowUrl).then(function (firstRowDataObject) { 
    firstRowDataObject.json().then(function (firstRowDataOutput) { 

      /*
      wholeMarketCap = Math.round(firstRowDataOutput.data.total_market_cap.usd);
      console.log( "inside first row, wholeMarketCap") 
      console.log(wholeMarketCap) 
      */

      // To get the right formatting for the first row 24h price change in percent
    
      const firstRowpercentPriceChangeFormatted = Number((firstRowDataOutput).data.market_cap_change_percentage_24h_usd / 100).toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2,
      });

      //To change the color of the first row 24h price change in percent
      let firstRowpriceColor = "blackText";
      let firstRowpercentPriceChange = (firstRowDataOutput).data.market_cap_change_percentage_24h_usd;
      if (firstRowpercentPriceChange > 0) {
        firstRowpriceColor = "greenText";
      } else {
        firstRowpriceColor = "redText";
      };

                                                                    
      $("#firstRowMarketCap").html(`Market Cap: <a href=''> ${usdFormatter.format(Math.round(firstRowDataOutput.data.total_market_cap.usd))} </a> `);
      $("#firstRowMarkCapChngPerc24hUSD").html(` Market Cap Change 24h: <span class="${firstRowpriceColor}">${firstRowpercentPriceChangeFormatted}</span>`);
      // $("#firstRowBTCDominance").html("BTC Dominance: " + "<a href=''>" + (firstRowDataOutput).data.active_cryptocurrencies + "</a>");
      $("#firstRow24hVol").html(`24h Vol: <a href=''>${usdFormatter.format(Math.round(firstRowDataOutput.data.total_volume.usd))}</a>`);
      $("#firstRowCryptocurrencies").html("Cryptocurrencies: " + "<a href=''>" + (firstRowDataOutput).data.active_cryptocurrencies + "</a>");
      $("#firstRowMarkets").html("Markets: " + "<a href=''>" + (firstRowDataOutput).data.markets + "</a>");
    
    });
  });

  let COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
  
  let pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;

  function loadCorrectPage () {
    COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
    pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;
    
  };

  $(".lastPageButton").hide();

  loadCorrectPage();

  tableBuildingFunction();

  // This creates a colored shadow around the mockup buttons to the left when clicked, and then takes it out after a set time
  $(".cryptoCurrenciesBtn, .exchangesButton").click(function() {
    $(this).css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.1)");
    let clickedButtonBeforeBrdrRmvd = 0;
    clickedButtonBeforeBrdrRmvd = $(this);
    setTimeout (function(){clickedButtonBeforeBrdrRmvd.css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)")}, 1200);
  });

  $(".nextPageButton, .lastPageButton").click(function() {
    
    $(this).css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.1)");    

    var myArray = Object.values($(this));
    console.log("button clicked from " + myArray);  


    if ($(this).hasClass("nextPageButton") == true) {
      pageCounter += 1;
    } else if ($(this).hasClass("lastPageButton") == true) {
      pageCounter -= 1;
    };
 
    if (pageCounter <= 1) {
      pageCounter = 1;
      $(".lastPageButton").hide();      
    };

    if (pageCounter > 1) {
      $(".lastPageButton").show();
    };
    
    if (pageCounter < 10) {
        $(".nextPageButton").show();
    };

    if (pageCounter >= 10) {
      pageCounter = 10;
      $(".nextPageButton").hide();
    };
    
    
    loadCorrectPage();    

    tableBuildingFunction();

    let clickedButtonBeforeBrdrRmvd = 0;
    clickedButtonBeforeBrdrRmvd = $(this);
    setTimeout (function(){clickedButtonBeforeBrdrRmvd.css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)")}, 1200);
  

  });
  
  function tableBuildingFunction () {
    loadCorrectPage();    

    fetch(pageToFetch).then(function (res) {
      pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;      
      res.json().then(function (data) {
        //console.log( "Inside table builder, BTC Market Cap" )
        // this is wrong, data[0] is only BTC on page 1. console.log(  data[0].market_cap  ) 

        
        $("#largeIntroTextField").html(`Top Cryptocurrencies by Market Cap Page ${pageCounter}`);

        if (pageCounter == 1) {
          $("#largeIntroTextField").html(`Top 100 Cryptocurrencies by Market Cap`);
        } 
      

        console.log(data);
        $("#tableBody").empty();

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

          let cryptoCurrencyUnit = (data[i].symbol.toUpperCase());
          if (cryptoCurrencyUnit.length > 6) {
            cryptoCurrencyUnit = cryptoCurrencyUnit.substring(0, 5) + "...";             
          }
          
          


          
          //To generate the market data table rows and append them to the existing html table
          $("#tableBody").append(
            `
              <tr class="lessPaddingforRow">
                <td scope="col" class="textAllignCenter lessPaddingforRow align-middle ">${(i + 1) + ((100*pageCounter)-100)}</td>              
                <td scope="col" class="lessPaddingforRow align-middle"><img class="iconSpacing my" src="${data[i].image}"></img><b>${data[i].name}</b></td>
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle">${usdFormatter.format(data[i].market_cap)}</td>
                                          
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle"><a href="">${priceFormatter.format(data[i].current_price)}</a></td>
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle"><a href="">${usdFormatter.format(data[i].total_volume)}</a></td>
                
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle"> ${simpleNumberFormatter.format(Math.round(data[i].circulating_supply))} ${cryptoCurrencyUnit} </td>
                                          
                <td class="${priceColor} textAllignCenter lessPaddingforRow align-middle" scope="col">${percentPriceChangeFormatted}</td>
                <td scope="col" id="incomingSparkline${i}" class="lessPaddingforRow align-middle sparklineField">  </td>
                <td scope="col" class="lessPaddingforRow align-middle">...</td>
              </tr>
            `
          );


          let incomingSparkArray = data[i].sparkline_in_7d.price;
          //console.log (incomingSparkArray);
          let outgoingSparkArray = [];

          for (let counter=0; counter<incomingSparkArray.length; counter++) {
           outgoingSparkArray.push($(incomingSparkArray)[counter]); 
          };

          $("#incomingSparkline"+i).sparkline(outgoingSparkArray, {
            type: 'line',
            width: '164px',
            height: '48px',
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
