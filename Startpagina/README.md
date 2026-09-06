# Startpagina

De startpagina van **https://startdagen.peno1.be**, in KU Leuven-huisstijl
(kleuren en logo uit het officiële logo-SVG). Nieuwe onderdelen voeg je toe
door in [index.html](index.html) een extra kaart (`<a class="card" ...>`) te
zetten en in [../wsgi.py](../wsgi.py) een route.

Onderdelen in deze map:

- [index.html](index.html): de startpagina met de tegels.
- [schijf.html](schijf.html) (`/schijf`): configurator die een lasersnij-SVG
  van de draaischijf maakt.
- [simulatie.html](simulatie.html) (`/simulatie`): simulator van de Smart
  Coffee Maker (bakjes op de brug, draai-arm en suikertje, servostappen).
  De begeleidersinstellingen (overbrenging van de tandwielen, draairichting,
  marges, armlengte, ...) staan bewust niet in de interface maar in
  [static/simulatie-config.js](static/simulatie-config.js): aanpassen,
  committen en opnieuw deployen.

Deze map bevat enkel de statische inhoud. De pagina wordt geserveerd door
de gecombineerde app in [../wsgi.py](../wsgi.py); zie
[../DEPLOY.md](../DEPLOY.md) voor het deployen.
