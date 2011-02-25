from django.http import Http404, HttpResponse
from django.conf import settings

def message_mark_read(request, message_id):
    '''
    Handle 404 exception and allow mark read requests for unexisted messages
    '''
    if 'persistent_messages' in settings.INSTALLED_APPS:
        from persistent_messages.views import message_mark_read as message_mark_read_original
        try:
            return message_mark_read_original(request, message_id)
        except Http404:
            return HttpResponse('')
    else:
        raise Http404