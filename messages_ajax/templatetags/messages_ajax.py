# -*- coding: utf-8 -*-
from django import template
from django.core.serializers import json
from django.utils import simplejson

register = template.Library()

@register.simple_tag
def init_messages(messages, container_selector):

    messages = [{'tags': message.tags, 'text': message.message} for message in messages]
    messages = simplejson.dumps(messages, cls=json.DjangoJSONEncoder, ensure_ascii=False)

    return '''<script type="text/javascript">
        $(function() {
            $.django.messages.initParseJsonResponses();
            $.django.messages.container = '%s',
            $.django.messages.showMany(%s);
        });
    </script>''' % (container_selector, messages)