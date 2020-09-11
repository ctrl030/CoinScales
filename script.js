$(document).ready(function () {
  let pageCounter = 1;
  
  let BASE_URL = "https://api.coingecko.com/api/v3";
  let COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
  
  let pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;

  function loadCorrectPage () {
    COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
    pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;
    console.log(pageToFetch);
  };

  $("#lastPageButton").hide();

  loadCorrectPage();

  tableBuildingFunction();

   
  function takeOutClickedNextBtnBrdr()  {
    $("#nextPageButton").css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)");
  };
 
  function callTakeOutClickedNextBtnBrdr()  {
    setTimeout (takeOutClickedNextBtnBrdr, 600);          
  };

  function takeOutClickedLastBtnBrdr()  {
    $("#lastPageButton").css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)");
  };
 
  function callTakeOutClickedLastBtnBrdr()  {
    setTimeout (takeOutClickedLastBtnBrdr, 600);          
  };



  $("#nextPageButton").click(function(){
    takeOutClickedLastBtnBrdr();
    $("#nextPageButton").css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.5)");  
    pageCounter += 1;
    $("#tableBody").empty(); 

    if (pageCounter >1) {
      $("#lastPageButton").show();
    }
    
    if (pageCounter >=10) {
      pageCounter = 10;
      $("#nextPageButton").hide();
    }
    console.log(pageCounter);
    loadCorrectPage();    
    tableBuildingFunction();
 
    callTakeOutClickedNextBtnBrdr();

    $("#largeIntroTextField").html(`Top Crypto Currencies by Market Cap Page ${pageCounter}`);
 
  });



  $("#lastPageButton").click(function(){
    takeOutClickedNextBtnBrdr();
    $("#lastPageButton").css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.5)");
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
    loadCorrectPage(); 
    tableBuildingFunction();

    callTakeOutClickedLastBtnBrdr();

    $("#largeIntroTextField").html(`Top Crypto Currencies by Market Cap Page ${pageCounter}`); 
    if (pageCounter == 1) {
      $("#largeIntroTextField").html(`Top 100 Crypto Currencies by Market Cap`);
    } 

  });

  function tableBuildingFunction () {
    loadCorrectPage();
    

    fetch(pageToFetch).then(function (res) {
      pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;      
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
              <tr class="lessPaddingforRow">
                <td scope="col" class="lessPaddingforRow align-middle textAllignedCenter">${(i + 1) + ((100*pageCounter)-100)}</td>              
                <td scope="col" class="lessPaddingforRow align-middle"><img class="iconSpacing my" src="${data[i].image}"></img><b>${data[i].name}</b></td>
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle">${usdFormatter.format(data[i].market_cap)}</td>
                                          
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle">${usdFormatter.format(data[i].current_price)}</td>
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle">${usdFormatter.format(data[i].total_volume)}</td>
                
                <td scope="col" class="textAllignRight lessPaddingforRow align-middle"> ${simpleNumberFormatter.format(Math.round(data[i].circulating_supply))} ${(data[i].symbol.toUpperCase())}</td>
                                          
                <td class="priceChangePercentage ${priceColor} textAllignRight lessPaddingforRow align-middle" scope="col">${percentPriceChangeFormatted}</td>
                <td scope="col" id="placeholder${i}" class="lessPaddingforRow align-middle">  </td>
                <td scope="col" class="lessPaddingforRow align-middle">...</td>
              </tr>
            `
          );

          $("#placeholder"+i).sparkline(data[i].sparkline_in_7d.price, {
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
