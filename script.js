$(document).ready(function () {
  let BASE_URL = "https://api.coingecko.com/api/v3";

  let COINS_DATA_PAGE1_ENDPOINT ="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

  let coinsDataPage1url = BASE_URL + COINS_DATA_PAGE1_ENDPOINT;

  fetch(coinsDataPage1url).then(function (res) {
    res.json().then(function (data) {
      const usdFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumSignificantDigits: 20,
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



        $("#tableBody").append(
          `
            <tr>
              <td scope="col">${i + 1}</td>
              <td scope="col"><img style="height: 1em;  margin-right: 5px" src="${data[i].image}"></img>${data[i].name}</td>
              <td scope="col">${usdFormatter.format(data[i].market_cap)}</td>
                                        
              <td scope="col">${usdFormatter.format(data[i].current_price)}</td>
              <td scope="col">${usdFormatter.format(data[i].total_volume)}</td>
              <td scope="col">${data[i].circulating_supply}</td>
                                        
              <td class="priceChangePercentage ${priceColor}" scope="col">${percentPriceChangeFormatted}</td>
              <td scope="col">Graph Placeholder</td>
              <td scope="col">...</td>
            </tr>
          `
        );

      };
    });
  });
});
