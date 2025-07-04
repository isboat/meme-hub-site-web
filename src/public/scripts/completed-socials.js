function copyContract() {
    const contractText = document.getElementById('contractAddr').innerText;
    navigator.clipboard.writeText(contractText)
        .then(() => {
            alert('Contract address copied!');
        })
        .catch(err => {
            alert('Failed to copy text: ' + err);
        });
}


let votes = 0;
const maxVotes = 3;
function vote(button) {
    if (button.classList.contains("voted")) {
        alert("You've already voted on this option.");
        return;
    }
    if (votes >= maxVotes) {
        alert("You can only vote for up to 3 metrics per visit.");
        return;
    }
    const countSpan = button.nextElementSibling;
    let count = parseInt(countSpan.innerText);
    countSpan.innerText = count + 1;
    button.classList.add("voted");
    votes++;
    if (votes === maxVotes) {
        document.getElementById("vote-note").innerText = "✅ You’ve used all 3 votes for this visit.";
    }
}

function renderToken() {
    var $tokenName = $('.token-name');
    $tokenName.text(token.name)

    const $desc = $('.token-desc')
    $desc.text(token.description)

    $("#tokenHeader").text("#" + token.tokenName)
    $("#launchDate").text(token.tokenData.createdDateTime)
    $("#contractAddr").text(token.contract)
    $("#symbol").text(token.tokenData.symbol)
    $("#marketCapSol").text(token.tokenData.rawData.marketCapSol)
    $("#pair").text(token.tokenData.symbol + "/SOL")

    var twitter = $('#twitterLink');
    twitter.attr('href', token.twitter);
    
    $('#telegramLink').attr('href', token.telegram);
    $('#bannerImg').attr('src', token.bannerUrl);

    $('#dextoolsLink').attr('href', token.dextools);
    $('#dexscreenerLink').attr('href', token.dexscreener);
    $('#websiteLink').attr('href', token.website);

  }

  getToken({ callbk: renderToken, url: "/token/socials/"});