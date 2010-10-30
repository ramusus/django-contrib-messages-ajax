$.fn.extend({
    showDjangoMessage: function(text, extra_tags) {
        var message = $('<li class="' + extra_tags + '">' + text + '</li>').hide();

        $(this).append(message);
        message.fadeIn(500);

        setTimeout(function() {
            message.fadeOut(500, function() {
                message.remove();
            });
        }, 3000);
    }
});


$(document).ready(function() {
    var messagesContainer = '#messages';
    $(messagesContainer).ajaxComplete(function(e, xhr, settings) {
        var contentType = xhr.getResponseHeader("Content-Type");

        if (contentType == "application/javascript" || contentType == "application/json") {
            var json = $.parseJSON(xhr.responseText);

            $.each(json.django_messages, function (i, item) {
                $(this).showDjangoMessage(item.message, item.extra_tags);
            });
        }
    }).ajaxError(function(e, xhr, settings, exception) {
        $(this).showDjangoMessage("There was an error processing your request, please try again.", "error");
    });
});