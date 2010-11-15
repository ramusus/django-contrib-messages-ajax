/**
 * jQuery django messages plugin - part of jQuery django plugin
 * External dependencies:
 * - sprintf
 */
(function($) {
    /**
     * Common plugin for integrating Django and jQuery
     */
    if(!$.django)
        $.django = {}
    if(!gettext)
        gettext = function(str) {return str};

    /**
     * Set of attributes and methods for interacting with django.contrib.messages app
     * @type
     */
    $.django.messages = {
        container: '#messages',
        messageContainer: '.message',
        closeContainer: 'li,a.hide',
        template: '<li class="%s">%s <a href="#" class="hide">hide</li>',
        autohideDelay: 3000,
        /**
         * Initialize autoparsing of ajax json responses
         */
        initParseJsonResponses: function() {
            $($.django.messages.container).ajaxComplete(function(e, xhr, settings) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if(contentType == "application/javascript" || contentType == "application/json") {
                    var json = $.parseJSON(xhr.responseText);
                    if(json.django_messages) {
                        $.django.messages.showMany(json.django_messages);
                    }
                }
            }).ajaxError(function(e, xhr, settings, exception) {
                $.django.messages.showNew(gettext("There was an error processing your request, please try again."), "error");
            });
        },
        /**
         * Initialize close button for all messages
         */
        initCloseButton: function() {
            $($.django.messages.container).find($.django.messages.closeContainer).one('click', function() {
                $(this).closest($.django.messages.messageContainer).remove();
                return false;
            });
        },
        /**
         * Show new messages
         * @param {String} text message's text
         * @param {String} tags message's tags
         * @param {Boolean} autohide is it necessary autohide message after $.django.messages.autohideDelay miliseconds
         */
        showNew: function(text, tags, autohide) {

            if(tags.match(/autohide/)) {
                autohide = true;
            }

            var message = $(sprintf($.django.messages.template, tags, text)).hide();

            $($.django.messages.container).append(message);
            message.fadeIn(500);

            if(autohide) {
                setTimeout(function() {
                    message.fadeOut(500, function() {
                        message.remove();
                    });
                }, $.django.messages.autohideDelay);
            }

            $.django.messages.initCloseButton();
        },
        /**
         * Show all bunch of messages. Useful in non-ajax requests
         * @param {Array} messages messages array
         */
        showMany: function(messages) {
            $.each(messages, function(i, message) {
                $.django.messages.showNew(message.text, message.tags, false);
            });
        }
    };

})(jQuery);