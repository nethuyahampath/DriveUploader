// After all elements loaded in index.html this jQuery function will invoked
$(document).ready(function() {
  //Id of the created client in the google developer console
  var clientId =
    "489555557929-gg7g4cocvoej26qgl62cr5k062ukocis.apps.googleusercontent.com";
  //Url which user redirects to
  var redirect_uri = "http://localhost:8080/DriveUploader/upload.html";
  //Accessing google api
  var scope = "https://www.googleapis.com/auth/drive";
  url = "";

  //when the button clicks this function operates
  $("#getAccess").click(function() {
    getGoogleAccess(clientId, redirect_uri, scope, url);
  });

  //get google access by passing the clientId, redirect_uri, scope and url.
  function getGoogleAccess(clientId, redirect_uri, scope, url) {
    url =
      "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" +
      redirect_uri +
      "&prompt=consent&response_type=code&client_id=" +
      clientId +
      "&scope=" +
      scope +
      "&access_type=offline";
    // makes the user go to the url
    window.location = url;
  }
});
