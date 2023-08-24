# Informatie

## Requirements
- Python 3.6+
- PySerial
- Flask

Deze kunnen makkelijk geinstalleerd worden met pip:
```bash
python -m pip install pyserial flask
```

## Gebruik
Het enigste wat je eigenlijk moet doen is de server starten. De server zal dan automatisch de Arduino vinden en de webserver starten. De webserver is te bereiken op http://localhost/, maar het IP adres van de computer kan ook gebruikt worden en zal sneller werken dan localhost. Het IP adres verschijnt als de server gestart wordt. En je moet die kiezen die start met 10... 

Om de server te starten zorg dat jouw terminal zich bevindt in de map waar de Server.py file zich bevindt en voer dan volgend commando uit:
```bash
python Server.py
```

Voor de beginner tutorial moet op de arduino ook het juiste programma geupload worden. Dit kan met de Arduino IDE. Het programma is te vinden in de map Arduino/BeginnerTutorial/BeginnerTutorial.ino

Om de server te stoppen moet je ctrl+c duwen in de terminal waar de server draait.


Je kan ook een clickable file maken om de server te starten. Dit kan door de in de Start_Server.bat file de twee paden te vervangen door die van Python en die van de Server.py file zoals bijvoorbeeld:
```bash
@echo off
"C:\Users\Ron\AppData\Local\Programs\Python\Python39\python.exe" "C:\Users\Ron\Desktop\Startersdagen\Informatie\Server.py"
pause
```
Deze file kan je dan op je bureaublad zetten en dan kan je de server starten door erop te dubbelklikken.


## Structuur
- Arduino: De code voor de Arduino
- Server.py: De server die de Arduino aanstuurt en de webserver start
- templates: De HTML templates voor de webserver
- static: De statische bestanden voor de webserver (CSS, JS, etc.)

## Instructies
- De studenten kiezen eerst tussen de beginner en gevorderde tutorial
- De studenten volgen vervolgens de stappen van de tutorial 
- Ze kunnen altijd nog van tutorial veranderen door op de reset knop te duwen
- Als de beginner tutorial bezig is mag de Arduino IDE niet open staan, anders zal kan de server niet met de Arduino communiceren.
- Wanneer de server voor de eerste keer wordt gestart zal deze opzoek gaan naar de Arduino. Als de Arduino niet gevonden wordt zal de server niet starten. Dus dan mahg de Arduino IDE ook niet open staan. Zolang de Arduino verbonden is met de computer en niet verbonden is met de Arduino IDE zal de server de Arduino vinden en starten.
- Als de gevorderde tutorial bezig is mag de Arduino IDE wel open staan
- Het is niet erg als de webpagina wordt gerefreshed, de server zal de huidige stap onthouden en de studenten kunnen gewoon verder doen waar ze gebleven waren. Hun waardes gaan niet verloren zolang de server aan staat. Moest de computer uitvallen gaan de waardes wel verloren. 
- De server kan gestopt worden door op ctrl+c te duwen in de terminal waar de server draait.



## Werking
De server staat in contact met de Arduino via serial en stuurt commando's naar de Arduino. De Arduino stuurt dan weer data terug naar de server. De server stuurt deze data dan weer door naar de webserver. De webserver stuurt de data dan weer door naar de client. De client is de webbrowser. 

Er wordt eigenlijk één webpagina voortdurend getoond namelijk index.html, waarin een box zit, waarin de verschillende stappen van de tutorial worden getoond. Voor elke stap is er dus één aparte html pagina, te vinden onder templates. 

## Auteurs 
- Anton Lintermans
- Gilles Belmans

