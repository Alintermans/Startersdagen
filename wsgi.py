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


@landing.route('/schijf')
def schijf():
    return send_file(os.path.join(BASE_DIR, 'Startpagina', 'schijf.html'))


@landing.route('/simulatie')
def simulatie():
    return send_file(os.path.join(BASE_DIR, 'Startpagina', 'simulatie.html'))


def _bundel(naam, titel):
    # Bundel-pdf van een luik. Zodra Startpagina/static/<naam>.pdf bestaat,
    # wordt die in de browser getoond; tot dan een nette placeholder.
    pdf_pad = os.path.join(BASE_DIR, 'Startpagina', 'static', naam + '.pdf')
    if os.path.exists(pdf_pad):
        return send_file(pdf_pad, mimetype='application/pdf')
    return (
        '<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        f'<title>{titel} – Startdagen</title></head>'
        '<body style="font-family:\'Segoe UI\',Roboto,Arial,sans-serif;background:#f5f7f9;'
        'display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">'
        '<div style="background:#fff;border:1px solid #dfe3e6;border-top:4px solid #54BCEB;'
        'padding:32px 40px;max-width:480px;text-align:center">'
        f'<h1 style="color:#00407A;font-size:1.4rem;margin:0 0 12px">{titel}</h1>'
        '<p style="color:#666;margin:0 0 20px">De bundel staat nog niet online. '
        'Kom binnenkort terug!</p>'
        '<a href="/" style="color:#00407A;font-weight:600;text-decoration:none">'
        '&lsaquo; Terug naar de startpagina</a></div></body></html>'
    ), 200


@landing.route('/materie')
def materie():
    return _bundel('materie', 'Materie')


@landing.route('/chemie')
def chemie():
    return _bundel('chemie', 'Chemie')


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
