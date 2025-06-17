  
  const feed = document.getElementById('tokenFeed');
  const searchInput = document.getElementById('searchInput');
var token = {};

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenAdd = urlParams.get('token-addr');

  if(!tokenAdd) {
    // do something
    return;
  }

  $.ajax({
      url: apiBaseUrl + "/token/details/" + tokenAdd,
      type: "get", //send it through get method
      success: function(response) {
        //Do Something
        if(response) {
          token = response;
          renderToken()
        }
      },
      error: function(xhr) {
        //Do Something to handle error
      }
    });
}

  function renderToken() {
    var $tokenName = $('.token-name');
    $tokenName.text(token.name)

    const $desc = $('.token-desc')
    $desc.text(token.description)

    $('.token-logo').attr('src', token.image);
    $('.token-site').attr('href', token.website);
    $('.token-network').text('Solana');
    $('.token-contract').text(token.rawData.traderPublicKey);
    $('.token-mc').text(token.rawData.marketCapSol);
    $('.token-initialBuy').text(token.rawData.initialBuy);

  }

  getToken();