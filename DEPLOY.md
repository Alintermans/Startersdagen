# Startdagen deployen op Coolify

Eén container serveert alles op **https://startdagen.peno1.be**:

- `/` → de startpagina ([Startpagina/](Startpagina/))
- `/wiskunde/` → de Wiskunde-tutorial ([Wiskunde/](Wiskunde/))

De koppeling gebeurt in [wsgi.py](wsgi.py); de [Dockerfile](Dockerfile) in de
root bouwt het geheel. Nieuwe onderdelen kunnen later in `wsgi.py` onder een
eigen pad gemount worden (en dan op de startpagina een kaart erbij zetten,
zie [Startpagina/README.md](Startpagina/README.md)).

De studenten gebruiken hun eigen laptop. De camera én de live
gezichtsherkenning (kenmerken, make-up, eigen gezichten) draaien volledig
in hun browser met face-api.js — de server rekent daar niets aan. Enkel het
herkennen van de prof (pagina 13) gebeurt op de server: één frame per klik.
Elke groep heeft een eigen sessie, dus veel groepen tegelijk is geen
probleem.

## Stappen in Coolify

1. **+ New Resource** → deze Git-repository, branch `main`.
2. **Build Pack**: `Dockerfile` (Base Directory `/`, de standaard).
3. **Ports Exposes**: `3000`.
4. **Domains**: `https://startdagen.peno1.be` — Let's Encrypt gaat
   automatisch zodra de DNS klopt.
5. **Environment variables**:
   - `SECRET_KEY`: een lange willekeurige string (bv. de output van
     `openssl rand -hex 32`). Hiermee blijven de sessies van de studenten
     geldig na een redeploy.
   - Optioneel `WEB_CONCURRENCY`: aantal gunicorn workers (standaard 2;
     verhoog dit als de server veel CPU-cores heeft).
6. **Deploy**. De eerste build duurt lang (±10-15 min) omdat dlib
   gecompileerd wordt; daarna zit dat in de build cache.

## DNS (bij de registrar van peno1.be)

| Record | Naam | Waarde |
|---|---|---|
| A | `startdagen` | IP van de Coolify-server |

## Domein & HTTPS — belangrijk!

**De camera werkt alleen over HTTPS.** Browsers blokkeren `getUserMedia`
(camera-toegang) op onbeveiligde `http://`-adressen (behalve op localhost).
Zolang de domeinnaam er nog niet is, genereert Coolify zelf een domein
(`xxx.sslip.io`): daarover werkt alles al, behalve de camera-pagina's van
Wiskunde (11 en 13). Zodra `startdagen.peno1.be` met `https://` ingesteld
staat, werkt ook de camera.

## Lokaal testen met Docker

```bash
docker build -t startdagen .
```

```bash
docker run --rm -p 3000:3000 startdagen
```

Ga dan naar http://localhost:3000 — op `localhost` staat de browser de
camera ook zonder HTTPS toe.

## Goed om te weten

- De voortgang van de groepen staat in sessie-cookies; bij een redeploy
  verliezen ze hun stap. Deploy dus liever niet middenin een startdag.
- De zware verwerking gebeurt op de laptops van de studenten zelf
  (face-api.js). De server doet enkel de prof-herkenning: één dlib-frame
  per klik op "Detecteer de prof" — dat schaalt makkelijk naar tientallen
  groepen tegelijk.
- De Wiskunde-app blijft ook standalone werken voor lokale ontwikkeling:
  `cd Wiskunde && python Server.py` (zie [Wiskunde/README.md](Wiskunde/README.md)).
