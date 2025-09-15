#include <Servo.h>
#include <SoftwareSerial.h>

#define battery_led 2
#define red_led 5
#define green_led 6
#define blue_led 8
#define S0 4
#define S1 45
#define S2 44
#define S3 46
#define sensor 48
#define motor 10
#define servo_pin 12

SoftwareSerial mySerial(12, 11);  // TX, RX pins voor UART communicatie naar pico
Servo myServo;

int i;
int kleur_ID;
int rood_waarde;
int groen_waarde;
int blauw_waarde;

int zwart = 0;
int rood = 1;
int groen = 2;
int blauw = 3;

// Professor mapping naar letters (voor jullie referentie):
// a = Vandebril
// b = Van-hamme  
// c = Smets
// d = Vansteenwegen
// e = Dehaene
// f = Jacobs
// g = Beernaert
// h = De-Laet
// i = Rijmen
// j = Vanmeensel
// k = Van-Puyvelde
// l = Vander-Sloten
// m = Geraedts

void setup() {
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(battery_led, OUTPUT);
  pinMode(sensor, INPUT);
  
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);
  digitalWrite(battery_led, HIGH);
  
  myServo.attach(servo_pin);
  mySerial.begin(9600); // Start UART communicatie naar pico
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readString();
    input.trim(); // Verwijder whitespace en newlines
    Serial.print("Ontvangen: ");
    Serial.println(input);
    
    if (input.length() == 1) {
      char c = input.charAt(0);
      if (c == 's') {
        int colorCombination = detectColorCombination();
        stuur_servo(colorCombination);
      } else {
        Serial.println("Ongeldige invoer. Verstuur 's' om te starten.");
      }
    } else {
      Serial.println("Ongeldige invoer. Verstuur 's' om te starten.");
    }
  }
  delay(200);
}

/////////////////////////////////////////////////////////////
//PAS HIER AAN - check de waardes en vul in op de drie puntjes
int match_kleur(int rood_waarde, int groen_waarde, int blauw_waarde) {
  kleur_ID = 0;
  // if ((rood_waarde > ...) && (groen_waarde > ...) && (blauw_waarde > ...)) {
  //   Serial.println(" Zwart");
  //   kleur_ID = 0;
  // }
  // else if ((rood_waarde < ...) && (groen_waarde >...) && (blauw_waarde > ...)) {
  //   Serial.println("Rood");
  //   kleur_ID = 1;
  // }
  // else if ((rood_waarde > ...) && (groen_waarde < ...) && (blauw_waarde > ...)) {
  //   Serial.println("Groen");
  //   kleur_ID = 2;
  // }
  // else if ((rood_waarde > ...) && (groen_waarde > ...) && (blauw_waarde < ...)) {
  //   Serial.println("Blauw");
  //   kleur_ID = 3;
  // }
  // else if ((rood_waarde < ...) && (groen_waarde < ...) && (blauw_waarde < ...)) {
  //   Serial.println("Wit");
  //   kleur_ID = 4;
  // }
  // else {
  //   Serial.println("geen idee");
  //   kleur_ID = 8;
  // }
  Serial.print("Rood=");
  Serial.print(rood_waarde);
  Serial.print("    Groen= ");
  Serial.print(groen_waarde);
  Serial.print("    Blauw=");
  Serial.println(blauw_waarde);
  return kleur_ID;
}

// PAS HIER AAN - Maak servo sequenties voor elke drankoptie (0-7)
// 0=Koffie, 1=Thee, 2=Koffie met suiker, 3=Thee met suiker, 
// 4=Koffie met melk, 5=Thee met melk, 6=Koffie met melk en suiker, 7=Thee met melk en suiker

void maak_koffie() {
  // Voeg hier servo bewegingen toe voor het maken van koffie
  // Bijvoorbeeld: moveServo(90, 120);
}

void maak_thee() {
  // Voeg hier servo bewegingen toe voor het maken van thee
  // Bijvoorbeeld: moveServo(90, 160);
}

void maak_koffie_met_suiker() {
  // Voeg hier servo bewegingen toe voor het maken van koffie met suiker
  // Bijvoorbeeld: moveServo(90, 130);
}

void maak_thee_met_suiker() {
  // Voeg hier servo bewegingen toe voor het maken van thee met suiker
  // Bijvoorbeeld: moveServo(90, 150);
}

void maak_koffie_met_melk() {
  // Voeg hier servo bewegingen toe voor het maken van koffie met melk
  // Bijvoorbeeld: moveServo(90, 110);
}

void maak_thee_met_melk() {
  // Voeg hier servo bewegingen toe voor het maken van thee met melk
  // Bijvoorbeeld: moveServo(90, 135);
}

void maak_koffie_met_melk_en_suiker() {
  // Voeg hier servo bewegingen toe voor het maken van koffie met melk en suiker
  // Bijvoorbeeld: moveServo(90, 140);
}

void maak_thee_met_melk_en_suiker() {
  // Voeg hier servo bewegingen toe voor het maken van thee met melk en suiker
  // Bijvoorbeeld: moveServo(90, 170);
}

void stuur_servo(int kleur_ID) {
  digitalWrite(battery_led, LOW);

  // PAS HIER AAN - jullie moeten zelf bepalen:
  // 1. Welke kleurencombinatie (kleur_ID 0-12) bij welke professor hoort
  // 2. Welke professor welke van de 8 drankopties wil
  // 3. Roep de juiste maak_xxx() functie aan voor het drankje
  //
  // Professor letters: a=Vandebril, b=Van-hamme, c=Smets, d=Vansteenwegen, e=Dehaene, 
  //                   f=Jacobs, g=Beernaert, h=De-Laet, i=Rijmen, j=Vanmeensel, 
  //                   k=Van-Puyvelde, l=Vander-Sloten, m=Geraedts

  if (kleur_ID == 0) {
    //Zwart/Zwart -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  } 
  else if (kleur_ID == 1) {
    //Zwart/Rood -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 2) {
    //Zwart/Blauw -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 3) {
    //Zwart/Groen -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 4) {
    //Rood/Rood -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 5) {
    //Rood/Blauw -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 6) {
    //Rood/Groen -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 7) {
    //Rood/Wit -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 8) {
    //Blauw/Blauw -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 9) {
    //Blauw/Wit -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 10) {
    //Groen/Groen -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 11) {
    //Groen/Wit -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else if (kleur_ID == 12) {
    //Wit/Wit -> Professor ? -> Drankje ?
    Serial.println("... wordt gemaakt, even geduld");
    // sendLetterToPico('?'); // Vervang ? door de juiste professor letter (a-m)
    // maak_xxx(); // Vervang xxx door de juiste drankfunctie
  }
  else {
    Serial.println("geen idee");
  }
  delay(200);
  digitalWrite(battery_led, HIGH);
}

// UART communicatie naar pico - vervanger voor sendPico()
void sendLetterToPico(char letter) {
  Serial.print("Letter '");
  Serial.print(letter);
  Serial.println("' wordt naar de pico gestuurd via UART...");
  mySerial.println(letter);
}

///////////////////////////////////////////////////////
//NIET AANPASSEN

// Langzame servo beweging zoals in Beginner.ino
void moveServo(int startPos, int endPos) {
  int current = myServo.read();
  if (current < 0 || current > 180) {
    current = startPos; // gebruik start positie als huidige positie onleesbaar is
  }
  
  if (current != startPos) {
    // Beweeg eerst naar start positie
    int step = (startPos > current) ? 1 : -1;
    for (int pos = current; pos != startPos; pos += step) {
      myServo.write(pos);
      delay(20);
    }
  }
  
  // Beweeg van start naar eind positie
  if (startPos != endPos) {
    int step = (endPos > startPos) ? 1 : -1;
    const int stepDelayMs = 20;
    
    for (int pos = startPos; pos != endPos; pos += step) {
      myServo.write(pos);
      delay(stepDelayMs);
    }
  }
  
  // Zorg dat exacte eindpositie wordt geschreven
  myServo.write(endPos);
  delay(20);
}

int roodwaarde() {
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  rood_waarde = pulseIn(sensor, LOW);
  return rood_waarde;
}

int groenwaarde() {
  digitalWrite(S2, HIGH);
  digitalWrite(S3, HIGH);
  groen_waarde = pulseIn(sensor, LOW);
  return groen_waarde;
}

int blauwwaarde() {
  digitalWrite(S2, LOW);
  digitalWrite(S3, HIGH);
  blauw_waarde = pulseIn(sensor, LOW);
  return blauw_waarde;
}

int detectColorCombination() {
  int kleuren[10];
  for (int i = 0; i <= 10; i++) {
    int rood_waarde = roodwaarde();
    int groen_waarde = groenwaarde();
    int blauw_waarde = blauwwaarde();
    
    int kleur_ID = match_kleur(rood_waarde, groen_waarde, blauw_waarde);
    kleuren[i] = kleur_ID;
    delay(1000);
  }
  
  // count the number of times a color is detected
  int colorcounts[5] = {0, 0, 0, 0, 0};
  for (int i = 0; i < 10; i++) {
    if (kleuren[i] == 0) {
      colorcounts[0]++;
    }
    else if (kleuren[i] == 1) {
      colorcounts[1]++;
    }
    else if (kleuren[i] == 2) {
      colorcounts[2]++;
    }
    else if (kleuren[i] == 3) {
      colorcounts[3]++;
    }
    else {
      colorcounts[4]++;
    }
  }

  // determine the most two detected colors
  int max1 = 0;
  int max2 = 0;
  int color1 = 0;
  int color2 = 0;

  for (int i = 0; i < 5; i++) {
    if (colorcounts[i] > max1) {
      max2 = max1;
      max1 = colorcounts[i];
      color1 = i;
    }
    else if (colorcounts[i] > max2) {
      max2 = colorcounts[i];
      color2 = i;
    }
  }

  //determine color combination - 13 combinaties totaal
  int color_combination = 0;

  //Zwart/Zwart
  if (color1 == 0 && color2 == 0) {
    color_combination = 0;
  }
  //Zwart/Rood
  else if ((color1 == 0 && color2 == 1) || (color1 == 1 && color2 == 0)) {
    color_combination = 1;
  }
  //Zwart/Blauw
  else if ((color1 == 0 && color2 == 3) || (color1 == 3 && color2 == 0)) {
    color_combination = 2;
  }
  //Zwart/Groen
  else if ((color1 == 0 && color2 == 2) || (color1 == 2 && color2 == 0)) {
    color_combination = 3;
  }
  //Rood/Rood
  else if (color1 == 1 && color2 == 1) {
    color_combination = 4;
  }
  //Rood/Blauw
  else if ((color1 == 1 && color2 == 3) || (color1 == 3 && color2 == 1)) {
    color_combination = 5;
  }
  //Rood/Groen
  else if ((color1 == 1 && color2 == 2) || (color1 == 2 && color2 == 1)) {
    color_combination = 6;
  }
  //Rood/Wit
  else if ((color1 == 1 && color2 == 4) || (color1 == 4 && color2 == 1)) {
    color_combination = 7;
  }
  //Blauw/Blauw
  else if (color1 == 3 && color2 == 3) {
    color_combination = 8;
  }
  //Blauw/Wit
  else if ((color1 == 3 && color2 == 4) || (color1 == 4 && color2 == 3)) {
    color_combination = 9;
  }
  //Groen/Groen
  else if (color1 == 2 && color2 == 2) {
    color_combination = 10;
  }
  //Groen/Wit
  else if ((color1 == 2 && color2 == 4) || (color1 == 4 && color2 == 2)) {
    color_combination = 11;
  }
  //Wit/Wit
  else if (color1 == 4 && color2 == 4) {
    color_combination = 12;
  }

  return color_combination;
}
