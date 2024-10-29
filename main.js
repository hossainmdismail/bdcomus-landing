
(function ($) {
    "use strict";
    var ajaxSubscribe = {
      obj: {
        subscribeEmail: $("#subscribe-email"),
        subscribeButton: $("#subscribe-button"),
        subscribeMsg: $("#subscribe-msg"),
        subscribeContent: $("#subscribe-content"),
        dataMailchimp: $("#subscribe-form").attr("data-mailchimp"),
        success_message:
          '<div class="notification_ok">Thank you for joining our mailing list!</div>',
        failure_message:
          '<div class="notification_error">Error! <strong>There was a problem processing your submission.</strong></div>',
        noticeError: '<div class="notification_error">{msg}</div>',
        noticeInfo: '<div class="notification_error">{msg}</div>',
        basicAction: "mail/subscribe.php",
        mailChimpAction: "mail/subscribe-mailchimp.php",
      },
  
      eventLoad: function () {
        var objUse = ajaxSubscribe.obj;
  
        $(objUse.subscribeButton).on("click", function () {
          if (window.ajaxCalling) return;
          var isMailchimp = objUse.dataMailchimp === "true";
  
          // if (isMailchimp) {
          //   ajaxSubscribe.ajaxCall(objUse.mailChimpAction);
          // } else {
          //   ajaxSubscribe.ajaxCall(objUse.basicAction);
          // }
          ajaxSubscribe.ajaxCall(objUse.basicAction);
        });
      },
  
      ajaxCall: function (action) {
        window.ajaxCalling = true;
        var objUse = ajaxSubscribe.obj;
        var messageDiv = objUse.subscribeMsg.html("").hide();
        $.ajax({
          url: action,
          type: "POST",
          dataType: "json",
          data: {
            subscribeEmail: objUse.subscribeEmail.val(),
          },
          success: function (responseData, textStatus, jqXHR) {
            if (responseData.status) {
              objUse.subscribeContent.fadeOut(500, function () {
                messageDiv.html(objUse.success_message).fadeIn(500);
              });
            } else {
              switch (responseData.msg) {
                case "email-required":
                  messageDiv.html(
                    objUse.noticeError.replace(
                      "{msg}",
                      "Error! <strong>Email is required.</strong>"
                    )
                  );
                  break;
                case "email-err":
                  messageDiv.html(
                    objUse.noticeError.replace(
                      "{msg}",
                      "Error! <strong>Email invalid.</strong>"
                    )
                  );
                  break;
                case "duplicate":
                  messageDiv.html(
                    objUse.noticeError.replace(
                      "{msg}",
                      "Error! <strong>Email is duplicate.</strong>"
                    )
                  );
                  break;
                case "filewrite":
                  messageDiv.html(
                    objUse.noticeInfo.replace(
                      "{msg}",
                      "Error! <strong>Mail list file is open.</strong>"
                    )
                  );
                  break;
                case "undefined":
                  messageDiv.html(
                    objUse.noticeInfo.replace(
                      "{msg}",
                      "Error! <strong>undefined error.</strong>"
                    )
                  );
                  break;
                case "api-error":
                  objUse.subscribeContent.fadeOut(500, function () {
                    messageDiv.html(objUse.failure_message);
                  });
              }
              messageDiv.fadeIn(500);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert("Connection error");
          },
          complete: function (data) {
            window.ajaxCalling = false;
          },
        });
      },
    };

    // Dom Ready
    $(function () {
      ajaxSubscribe.eventLoad();
    });
  })(jQuery);
  