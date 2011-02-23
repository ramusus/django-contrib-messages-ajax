from django.contrib import messages
from django.utils import simplejson
from utils import get_message_dict

class AjaxMessaging(object):
    '''
    Middlware for JSON responses. It adds to each JSON response array with messages from django.contrib.messages framework
    It allows handle messages on a page with javascript
    '''
    def process_response(self, request, response):
        if request.is_ajax():
            if response['Content-Type'] in ["application/javascript", "application/json"]:
                try:
                    content = simplejson.loads(response.content)
                    assert isinstance(content, dict)
                except (ValueError, AssertionError):
                    return response

                content['django_messages'] = [get_message_dict(message) for message in messages.get_messages(request)]

                response.content = simplejson.dumps(content)
        return response


