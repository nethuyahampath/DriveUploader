// After all elements loaded in upload.html this jQuery function will invoked
$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const redirect_uri = "http://localhost:8080/DriveUploader/upload.html";
  const client_secret = "7El71Ks-MR6xqsA-97iAkuzo";
  const scope = "https://www.googleapis.com/auth/drive";
  var access_token = "";
  var client_id =
    "489555557929-gg7g4cocvoej26qgl62cr5k062ukocis.apps.googleusercontent.com";

  //api calling
  $.ajax({
    type: "POST",
    //request making
    url: "https://www.googleapis.com/oauth2/v4/token",
    data: {
      code: code,
      redirect_uri: redirect_uri,
      client_secret: client_secret,
      client_id: client_id,
      scope: scope,
      grant_type: "authorization_code" //grant_type that set to client_credentials
    },
    dataType: "json",
    success: function(resultData) {
      localStorage.setItem("accessToken", resultData.access_token);
      localStorage.setItem("refreshToken", resultData.refreshToken);
      localStorage.setItem("expires_in", resultData.expires_in);
      localStorage.setItem("tokenType", resultData.token_type);
      window.history.pushState(
        {},
        document.title,
        "/GoogleLoginApp/" + "upload.html"
      );
      console.log(resultData);
    }
  });

  //validation process
  function stripQueryStringAndHashFromPath(url) {
    return url.split("?")[0].split("#")[0];
  }

  var Upload = function(file) {
    this.file = file;
  };

  Upload.prototype.getType = function() {
    localStorage.setItem("type", this.file.type);
    return this.file.type;
  };
  Upload.prototype.getSize = function() {
    localStorage.setItem("size", this.file.size);
    return this.file.size;
  };
  Upload.prototype.getName = function() {
    return this.file.name;
  };
  Upload.prototype.doUpload = function() {
    var that = this;
    var formData = new FormData();

    // add assoc key values
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);

    $.ajax({
      type: "POST",
      beforeSend: function(request) {
        //setting the request header "Authorization"
        request.setRequestHeader(
          "Authorization",
          "Bearer" + " " + localStorage.getItem("accessToken")
        );
      },
      //endpoint url
      url: "https://www.googleapis.com/upload/drive/v2/files",
      data: {
        uploadType: "media"
      },
      xhr: function() {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener(
            "progress",
            that.progressHandling,
            false
          );
        }
        return myXhr;
      },
      //print after success
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        console.log(error);
      },
      async: true,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000
    });
  };
  //progress bar
  Upload.prototype.progressHandling = function(event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progress_bar_id = "#progress-wrp";
    if (event.lengthComputable) {
      percent = Math.ceil((position / total) * 100);
    }
    // update progressbars classes so it fits your code
    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
    $(progress_bar_id + " .status").text(percent + "%");
  };

  //uploading process

  $("#upload").on("click", function(e) {
    var file = $("#files")[0].files[0];
    var upload = new Upload(file);

    // execute upload operation
    upload.doUpload();
  });
});
