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

SoftwareSerial mySerial(12, 11); // TX, RX pins voor UART communicatie naar pico
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

  delay(1000);

  
  Serial.println("Template test pico - UART communicatie");
  Serial.println("Verstuur een letter (a-m) om een professor te selecteren:");
  Serial.println("a=Vandebril, b=Van-hamme, c=Smets, d=Vansteenwegen, e=Dehaene");
  Serial.println("f=Jacobs, g=Beernaert, h=De-Laet, i=Rijmen, j=Vanmeensel");
  Serial.println("k=Van-Puyvelde, l=Vander-Sloten, m=Geraedts");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readString();
    input.trim(); // Verwijder whitespace en newlines
    Serial.print("Ontvangen: ");
    Serial.println(input);
    
    // Check of het een geldige letter is (a-m voor 13 professoren)
    if (input.length() == 1) {
      char c = input.charAt(0);
      if (c >= 'a' && c <= 'm') {
        sendLetterToPico(c);
      } else if (c >= 'A' && c <= 'M') {
        // Ook hoofdletters accepteren
        sendLetterToPico(c + 32); // converteer naar lowercase
      } else {
        Serial.println("Ongeldige invoer. Gebruik letters a-m voor de 13 professoren.");
      }
    } else {
      Serial.println("Ongeldige invoer. Gebruik één letter (a-m) voor de 13 professoren.");
    }
  }
  delay(200);
}

// UART communicatie naar pico - dezelfde functie als in template_final_file
void sendLetterToPico(char letter) {
  Serial.print("Letter '");
  Serial.print(letter);
  Serial.println("' wordt naar de pico gestuurd via UART...");
  mySerial.println(letter);
  Serial.println("De pico zou nu het liedje van de corresponderende professor moeten afspelen");
  Serial.println("en de naam van de professor tonen op het OLED scherm.");
}
