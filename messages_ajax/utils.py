from django.conf import settings

def get_message_dict(message):
    '''
    Returns message dictionary. If `persistent_messages` used includes
    additional attributes, such as `id`, for special actions with messages (marking read)
    '''
    message_dict = {
        'level': message.level,
        'text': message.message,
        'tags': message.tags,
    }
    if 'persistent_messages' in settings.INSTALLED_APPS:
        message_dict.update({
            'id': message.pk,
        })
    return message_dict