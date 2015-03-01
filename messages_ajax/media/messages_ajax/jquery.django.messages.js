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
        template: '<li class="message">%s <a href="#" class="hide">hide</li>',
        autohideDelay: 3000,
        persistent: false,
        /**
         * Initialize autoparsing of ajax json responses
         */
        initParseJsonResponses: function() {
            $(document).ajaxComplete(function(e, xhr, settings) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if(contentType == "application/javascript" || contentType == "application/json") {
                    var json = $.parseJSON(xhr.responseText);
                    if(json.django_messages) {
                        $.django.messages.showMany(json.django_messages);
                    }
                }
            }).ajaxError(function(e, xhr, settings, exception) {
                var message = {
                    text: gettext('There was an error processing your request, please try again.'),
                    tags: 'error'
                }
                $.django.messages.showNew(message);
            });
        },
        /**
         * Initialize close button for all messages
         */
        initCloseButton: function() {

            var closeMessage = function(clickContainer, callbackFunction) {
                var messageContainer = $(clickContainer).closest($.django.messages.messageContainer);
                var id = messageContainer.attr('id');
                messageContainer.remove();
                if($.django.messages.persistent && id) {
                    $.django.messages.persistentMarkRead(id.replace('message', ''), callbackFunction);
                } else if(callbackFunction) {
                    callbackFunction();
                }
                return false;
            }

            // bind closeMessage action by clicking to closeContainer
            $($.django.messages.container).find($.django.messages.closeContainer).one('click', function() {
                closeMessage(this);
            });
            // bind closeMessage action to all links and go to link's href after closing
            $('a', $.django.messages.container).not($.django.messages.closeContainer).one('click', function() {
                var href = $(this).attr('href');
                closeMessage(this, function() {
                    document.location.href = href;
                });
                event.stopPropagation();
                return false;
            });
        },
        /**
         * Ajax call for marking message as read
         */
        persistentMarkRead: function(id, callbackFunction) {
            var url = $.django.urls.get('message_mark_read', id);
            if(url && id) {
                $.ajax({
                    url: url,
                    success: callbackFunction
                });
            }
        },
        /**
         * Show new messages
         * @param {String} text message's text
         * @param {String} tags message's tags
         * @param {Boolean} autohide is it necessary autohide message after $.django.messages.autohideDelay miliseconds
         */
        showNew: function(message, autohide) {

            if(message.tags.match(/autohide/)) {
                autohide = true;
            }

            var messageContainer = $(sprintf($.django.messages.template, message.text)).hide();
            $(messageContainer).addClass(message.tags);
            if($.django.messages.persistent && message.id) {
                // check if message with this id is not already showed to user
                if($('#message' + message.id).length)
                    return false;
                // set message.id if persistent_message installed
                $(messageContainer).attr('id', 'message' + message.id);
            }
            $($.django.messages.container).append(messageContainer);
            messageContainer.fadeIn(500);

            if(autohide) {
                setTimeout(function() {
                    messageContainer.fadeOut(500, function() {
                        messageContainer.remove();
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
                $.django.messages.showNew(message, false);
            });
        }
    };

})(jQuery);
