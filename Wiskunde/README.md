# Wiskunde

Webtutorial over gezichtsherkenning. De studenten volgen de tutorial op hun
eigen laptop; de server draait in een Docker container (bv. op Coolify).
De camera én de live gezichtsherkenning (kenmerken, make-up, eigen
gezichten) draaien volledig in de browser van de student met face-api.js.
Enkel het herkennen van de proffen (pagina 13) gebeurt op de server met
dlib / face_recognition: één frame per klik.

## Deployment

Deze app wordt samen met de startpagina als één container gedeployed op
`https://startdagen.peno1.be/wiskunde/` — zie [../DEPLOY.md](../DEPLOY.md).
Let op: de camera werkt in de browser alleen over **HTTPS** (of op localhost).

## Lokaal draaien

Met Docker (aangeraden, geen dlib-installatie nodig; bouwt de volledige
site inclusief startpagina, vanuit de root van de repo):
```bash
docker build -t startdagen .. && docker run --rm -p 3000:3000 startdagen
```

Of rechtstreeks met Python 3.11 (enkel de Wiskunde-app, op de root):
```bash
pip install -r requirements.txt
python Server.py
```

De site is daarna te bereiken op http://localhost:3000

## Structuur

- `Server.py`: de Flask-server (sessie per groepje, prof-herkenning)
- `FaceRecognition.py`: de prof-herkenning (dlib / face_recognition)
- `face-recognition/`: de foto's en opgeslagen encodings van de proffen
- `templates/`: de HTML-pagina's van de tutorial (per stap één pagina)
- `static/`: CSS, JavaScript en afbeeldingen; `static/models/` bevat de
  face-api.js-modellen die in de browser draaien
- `requirements.txt`: de Python-dependencies (gebruikt door de Dockerfile in de root)

## Werking

Eén pagina (index.html) wordt voortdurend getoond; daarin worden de
verschillende stappen van de tutorial geladen. De voortgang zit in een
sessie-cookie, dus elke groep heeft zijn eigen voortgang en eigen
gezichten-database, en een refresh is geen probleem.

Op de camera-pagina's vraagt de browser toegang tot de webcam van de laptop
(getUserMedia). De gezichtskenmerken, make-up en herkenning van zelf
toegevoegde gezichten worden volledig lokaal berekend met face-api.js
(de modellen staan in `static/models/`). Alleen bij "Detecteer de prof"
(pagina 13) stuurt de browser één frame naar `/detect_face`, waar de
nauwkeurigere dlib-herkenning de prof bepaalt.

## Auteurs
- Anton Lintermans
- Gilles Belmans
