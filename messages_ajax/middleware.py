from django.contrib import messages
import simplejson as json

class AjaxMessaging(object):
    '''
    Middlware for JSON responses. It adds to each JSON response array with messages from django.contrib.messages framework
    It allows handle messages on a page with javascript
    '''
    def process_response(self, request, response):
        if request.is_ajax():
            if response['Content-Type'] in ["application/javascript", "application/json"]:
                try:
                    content = json.loads(response.content)
                    assert isinstance(content, dict)
                except (ValueError, AssertionError):
                    return response

                django_messages = []
                for message in messages.get_messages(request):
                    django_messages.append({
                        "level": message.level,
                        "text": message.message,
                        "tags": message.tags,
                    })

                content['django_messages'] = django_messages

                response.content = json.dumps(content)
        return response