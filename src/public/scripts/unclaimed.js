  
  const feed = document.getElementById('tokenFeed');
  const searchInput = document.getElementById('searchInput');
  const tokenNames = ['SolPepe', 'MoonDuck', 'FomoBomb', 'YoloCoin', 'SnipeX', 'HypeDoge', 'PepeEgg', 'ZoomRug', 'SolNeko', 'MemeStorm'];
var unclaimedTokens = [];

function getUnclaimedTokens() {
  $.ajax({
      url: apiBaseUrl + "/token/latestunclaimed",
      type: "get", //send it through get method
      success: function(response) {
        //Do Something
        if(response) {
          unclaimedTokens = response;
          addToken()
        }
      },
      error: function(xhr) {
        //Do Something to handle error
      }
    });
}

let tokenIndex = 0;

  function renderToken(token) {
    const div = document.createElement('div');
    div.className = 'card-details';
    div.setAttribute('data-address', token.rawData.mint);
    div.innerHTML = `<strong>${token.name}</strong><br/>InitialBuy: ${token.rawData.initialBuy}<br/>MC: $${token.rawData.marketCapSol}<br/>` + 
      `<a class="card-claim-now" href="token.html?token-addr=${token.rawData.mint}">Details</a><span> | </span>` + 
      `<a class="card-claim-now" href="submit-socials.html?token-addr=${token.rawData.mint}">Update Socials</a>`;

    const image = document.createElement('img')
    image.className = 'card-image';
    image.setAttribute('src', token.image)

    const container = document.createElement('div')
    container.className = 'card';
    container.appendChild(image)
    container.appendChild(div)
    return container;
  }

  function addToken() {
    const token = unclaimedTokens[tokenIndex++];
    const card = renderToken(token);
    feed.insertBefore(card, feed.firstChild);
    if (feed.children.length > 15) {
      feed.removeChild(feed.lastChild);
    }
  }

  function filterTokens() {
    const query = searchInput.value.toUpperCase();
    Array.from(feed.children).forEach(card => {
      const address = card.getAttribute('data-address');
      card.classList.toggle('hidden', !address.includes(query));
    });
  }

  searchInput.addEventListener('input', filterTokens);

  setInterval(addToken, 2000);
  getUnclaimedTokens();