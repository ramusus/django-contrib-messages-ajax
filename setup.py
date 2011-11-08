from setuptools import setup, find_packages

setup(
    name='django-contrib-messages-ajax',
    version=__import__('django-contrib-messages-ajax').__version__,
    description='Django messaging for AJAX calls using jQuery',
    long_description=open('README').read(),
    author='ramusus',
    author_email='ramusus@gmail.com',
    url='https://github.com/ramusus/django-contrib-messages-ajax',
    download_url='https://github.com/ramusus/django-contrib-messages-ajax/downloads',
    license='BSD',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False, # because we're including media that Django needs
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
)
