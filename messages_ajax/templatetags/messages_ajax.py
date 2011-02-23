# -*- coding: utf-8 -*-
from django import template
from django.conf import settings
from django.core.serializers import json
from django.utils import simplejson
from ..utils import get_message_dict

register = template.Library()

@register.simple_tag
def init_messages(messages, container_selector):
    '''
    Returns javascript initialize code for `messages_ajax` application
    '''
    messages = [get_message_dict(message) for message in messages]
    messages = simplejson.dumps(messages, cls=json.DjangoJSONEncoder, ensure_ascii=False)

    return '''
        <script type="text/javascript">
        /*<![CDATA[*/
            $(function() {
                $.django.messages.initParseJsonResponses();
                $.django.messages.container = '%(container)s',
                $.django.messages.persistent = %(persistent)s,
                $.django.messages.showMany(%(messages)s);
            });
        /*]]>*/
        </script>''' % {
            'container': container_selector,
            'persistent': 'true' if 'persistent_messages' in settings.INSTALLED_APPS else 'false',
            'messages': messages,
        }