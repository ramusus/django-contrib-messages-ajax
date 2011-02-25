from django.conf.urls.defaults import *

urlpatterns = patterns('messages_ajax.views',
    url(r'^mark_read/(?P<message_id>\d+)/$', 'message_mark_read', name='message_mark_read'),
)
