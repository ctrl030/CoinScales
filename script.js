$(document).ready(function () {

  // Navigation variable
  let pageCounter = 1;
  
  // Base url for endpoints
  let BASE_URL = "https://api.coingecko.com/api/v3";

  // Endpoint for first row with global market data
  let FIRST_ROW_ENDPOINT = "/global";  
  
  // Various formatters to convert and display the table data
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

  // Setting url to be querried at API endpoint for the first row's data
  let firstRowUrl = BASE_URL + FIRST_ROW_ENDPOINT;

  // Fetching the data for the first row and inserting it into the HTML structure
  fetch(firstRowUrl).then(function (firstRowDataObject) { 
    firstRowDataObject.json().then(function (firstRowDataOutput) { 

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
      
      // Formatting data and inserting it into HTML structure
      $("#firstRowMarketCap").html(`Market Cap: <a href=''> ${usdFormatter.format(Math.round(firstRowDataOutput.data.total_market_cap.usd))} </a> `);
      $("#firstRowMarkCapChngPerc24hUSD").html(` Market Cap Change 24h: <span class="${firstRowpriceColor}">${firstRowpercentPriceChangeFormatted}</span>`);
      $("#firstRow24hVol").html(`24h Vol: <a href=''>${usdFormatter.format(Math.round(firstRowDataOutput.data.total_volume.usd))}</a>`);
      $("#firstRowCryptocurrencies").html("Cryptocurrencies: " + "<a href=''>" + (firstRowDataOutput).data.active_cryptocurrencies + "</a>");
      $("#firstRowMarkets").html("Markets: " + "<a href=''>" + (firstRowDataOutput).data.markets + "</a>");

    });
  });

  // Setting API endpoint url for table data. Changes when navigation buttons are clicked and pageCounter variable is modified by that    
  let COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
  let pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;

  // function to update the table data endpoint, is for ex. called by the buttons to navigate
  function loadCorrectPage () {
    COINS_DATA_PAGE_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=" + pageCounter + "&sparkline=false&price_change_percentage=24h&sparkline=true";
    pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;    
  };

  // hides the lastPageButton class, as website starts on page 1 when visited
  $(".lastPageButton").hide();

  // Calling the loadCorrectPage function, querying the data for the first table on website startup
  loadCorrectPage();

  // Calling the tableBuildingFunction function, building the first table on website startup
  tableBuildingFunction();

  //Buttons section

  // This creates a colored shadow around the "Cryptocurrencies" and "Exchanges" buttons and then takes it out after a set time
  $(".cryptoCurrenciesBtn, .exchangesButton").click(function() {
    $(this).css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.1)");
    let clickedButtonBeforeBrdrRmvd = 0;
    clickedButtonBeforeBrdrRmvd = $(this);
    setTimeout (function(){clickedButtonBeforeBrdrRmvd.css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)")}, 1200);
  });

  // Has the same visual effect for the navigation buttons "Previous 100" and "Next 100" plus navigation logic
  $(".nextPageButton, .lastPageButton").click(function() {
    
    // CSS for buttons
    $(this).css("box-shadow", "0 0 0 0.2rem", "rgba (0,123,255,.1)");    

    // pageCounter is modified, depending on what kind of button was clicked, next or last
    if ($(this).hasClass("nextPageButton") == true) {
      pageCounter += 1;
    } else if ($(this).hasClass("lastPageButton") == true) {
      pageCounter -= 1;
    };
 
    // Defining when navigation buttons are displayed and hidden
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

    // Setting hardcoded limit of webpages of data to display, now set to 10 pages (top 1000 coins), numbers above will automatically be set to 10  
    if (pageCounter >= 10) {
      pageCounter = 10;
      $(".nextPageButton").hide();
    };
    
    // Updating and calling the new data endpoint after navigation button click
    loadCorrectPage();    

    // Building the new table from the updated data
    tableBuildingFunction();

    // CSS for buttons
    let clickedButtonBeforeBrdrRmvd = 0;
    clickedButtonBeforeBrdrRmvd = $(this);
    setTimeout (function(){clickedButtonBeforeBrdrRmvd.css("box-shadow", "0 0 0 0", "rgba (0, 0, 0, 0)")}, 1200);
  });
  
  // Function for updating and building cryptocurrency data table
  function tableBuildingFunction () {

    // Updating endpoint url and querying data
    loadCorrectPage();    

    // Fetching cryptocurrency table data
    fetch(pageToFetch).then(function (res) {
      pageToFetch = BASE_URL + COINS_DATA_PAGE_ENDPOINT;      
      res.json().then(function (data) {
        
        // Updating large navigation text field, diplays page number from page 2 and above
        $("#largeIntroTextField").html(`Top Cryptocurrencies by Market Cap Page ${pageCounter}`);

        // Large navigation text field definition for page 1
        if (pageCounter == 1) {
          $("#largeIntroTextField").html(`Top 100 Cryptocurrencies by Market Cap`);
        } 

        // Console.log for queryied, incoming crypto currency data, useful for further development 
        console.log(data);

        // Emptying the table body first
        $("#tableBody").empty();

        // iterating these operations once for every incoming cryptocurrency and it's data, resulting in 100 rows from this API
        for (let i = 0; i < data.length; i++) {

          //To change the color of the 24h price change in percent
          const percentPriceChange = Number(data[i].price_change_percentage_24h / 100);            
          let priceColor = "blackText";
          if (percentPriceChange > 0) {
            priceColor = "greenText";
          } else {
            priceColor = "redText";
          };

          // To get the right output formatting for the 24h price change in percent
          const percentPriceChangeFormatted = Number(data[i].price_change_percentage_24h / 100).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          });

          // To get the right output formatting for the cryptocurrency unit names
          let cryptoCurrencyUnit = (data[i].symbol.toUpperCase());
          if (cryptoCurrencyUnit.length > 6) {
            cryptoCurrencyUnit = cryptoCurrencyUnit.substring(0, 5) + "...";             
          }
          
          //Generating each cryptocurrency data table row and appending it to the emptied html table 
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

          // Creating a spark line from the queried data for each cryptocurrency
          let incomingSparkArray = data[i].sparkline_in_7d.price;
          let outgoingSparkArray = [];          

          for (let counter=2; counter<(incomingSparkArray.length-2); counter++) {
            let outgoingNumber = (( (incomingSparkArray[counter-2]) + (incomingSparkArray[counter-1]) + (incomingSparkArray[counter]) + (incomingSparkArray[counter+1]) + (incomingSparkArray[counter+2]) ) / 5);
            outgoingSparkArray.push(outgoingNumber);  
          }

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
