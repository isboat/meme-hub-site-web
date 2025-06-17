var token = {};

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenAdd = urlParams.get('token-addr');

  if (!tokenAdd) {
    // do something
    return;
  }

  $.ajax({
    url: apiBaseUrl + "/token/details/" + tokenAdd,
    type: "get", //send it through get method
    success: function (response) {
      //Do Something
      if (response) {
        token = response;
        renderToken()
      }
    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function renderToken() {
  var $tokenName = $('#tokenName');
  $tokenName.val(token.name)
  $('#ticker').val(token.rawData.symbol);
  $('#contract').val(token.rawData.mint);
}

$(document).ready(function () {
  
  $(".submit-claim-btn").click(function (evt) {
    evt.preventDefault();

    var form = $("#submitClaimForm");

    // you can't pass jQuery form it has to be JavaScript form object
    var formData = new FormData(form[0]);

    $.ajax({
      url: apiBaseUrl + "/token/submit-socials", // Change to your server-side script
      type: "POST",
      data: formData,
      contentType: false,// Important: Let the browser set this
      processData: false, // Important: Prevent jQuery from processing data
      success: function (response) {
        alert("Form submitted successfully!");
      },
      error: function () {
        alert("Error submitting form.");
      }
    });

  });
});
getToken();