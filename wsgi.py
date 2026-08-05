## Gecombineerde app voor startdagen.peno1.be:
##   /            -> de startpagina (Startpagina/)
##   /wiskunde/   -> de Wiskunde-tutorial (Wiskunde/Server.py, ongewijzigd)
##
## Nieuwe onderdelen kunnen later op dezelfde manier gemount worden in het
## `mounts` dict hieronder.
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, 'Wiskunde'))

from flask import Flask, send_file
from werkzeug.middleware.dispatcher import DispatcherMiddleware

from Server import app as wiskunde_app

landing = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'Startpagina', 'static'),
    static_url_path='/static',
)


@landing.route('/')
def index():
    return send_file(os.path.join(BASE_DIR, 'Startpagina', 'index.html'))


def _ensure_trailing_slash(wsgi_app):
    # Een bezoek aan /wiskunde (zonder slash) moet naar /wiskunde/ sturen,
    # anders resolven de relatieve URL's in de frontend tegen de root.
    def shim(environ, start_response):
        if environ.get('PATH_INFO', '') == '':
            location = environ.get('SCRIPT_NAME', '') + '/'
            start_response('308 Permanent Redirect', [('Location', location), ('Content-Length', '0')])
            return [b'']
        return wsgi_app(environ, start_response)
    return shim


mounts = {
    '/wiskunde': _ensure_trailing_slash(wiskunde_app),
}

app = DispatcherMiddleware(landing, mounts)


if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', int(os.environ.get('PORT', 3000)), app)
