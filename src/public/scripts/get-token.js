var token = {};

function getToken(options) {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenAdd = urlParams.get('token-addr');

  if (!tokenAdd) {
    // do something
    return;
  }

  $.ajax({
    url: apiBaseUrl + (options.url ?? "/token/details/") + tokenAdd,
    type: "get", //send it through get method
    success: function (response) {
      //Do Something
      if (response) {
        token = response;
        if(options.callbk) options.callbk()
      }
    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}