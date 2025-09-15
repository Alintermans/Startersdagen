#include <Servo.h>
Servo myservo;

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

int i;
int kleur_ID;
int rood_waarde;
int groen_waarde;
int blauw_waarde;

int zwart = 0;
int rood = 1;
int groen = 2;
int blauw = 3;
int wit = 4;


void setup() {
  // put your setup code here, to run once:
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(battery_led, OUTPUT);
  pinMode(sensor, INPUT);
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);
  digitalWrite(battery_led, HIGH);
  myservo.attach(servo_pin);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  int rood_waarde = roodwaarde();
  int groen_waarde = groenwaarde();
  int blauw_waarde = blauwwaarde();
  
  int kleur_ID = match_kleur(rood_waarde, groen_waarde, blauw_waarde);

  if (Serial.available() > 0) {
    char c = Serial.read();
    Serial.println(c);
    if (c == 's') {
      stuur_servo(kleur_ID);
    }
  }
  delay(500);
}


/////////////////////////////////////////////////////////////
//PAS HIER AAN
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
  // else if ((rood_waarde > 200) && (groen_waarde > 200) && (blauw_waarde < 200)) {
  //   Serial.println("Blauw");
  //   kleur_ID = 3;
  // }
  // else if ((rood_waarde < 100) && (groen_waarde < 100) && (blauw_waarde < 100)) {
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

void stuur_servo(int kleur_ID) {
  digitalWrite(battery_led, LOW);
  if (kleur_ID == zwart) {
    //Zwart
    Serial.println("... wordt gemaakt, even geduld");
  } 
  else if (kleur_ID == rood) {
    //Rood
    Serial.println("... wordt gemaakt, even geduld");
  }
  else if (kleur_ID == groen) {
    //Groen
    Serial.println("... wordt gemaakt, even geduld");
  }
  else if (kleur_ID == blauw) {
    //Blauw
    Serial.println("... wordt gemaakt, even geduld");
  }
else if (kleur_ID == wit) {
    //Wit
    Serial.println("... wordt gemaakt, even geduld");
  }
  delay(200);
  digitalWrite(battery_led, HIGH);
}

///////////////////////////////////////////////////////
//NIET AANPASSEN
int roodwaarde() {
  digitalWrite(S2,LOW);
  digitalWrite(S3, LOW);
  rood_waarde = pulseIn(sensor, LOW);
  return rood_waarde;
}

int groenwaarde() {
  digitalWrite(S2,HIGH);
  digitalWrite(S3, HIGH);
  groen_waarde = pulseIn(sensor, LOW);
  return groen_waarde;
}

int blauwwaarde(){
  digitalWrite(S2,LOW);
  digitalWrite(S3, HIGH);
  blauw_waarde = pulseIn(sensor, LOW);
  return blauw_waarde;
}


