#include <Servo.h>

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

Servo myServo;

long rood = 0;
long groen = 0;
long blauw = 0;

bool built_in_led = false;
bool motor_on = false;

// int zwart_r = 4500;
// int zwart_g = 7000;
// int zwart_b = 6500;

// int rood_r = 400;
// int rood_g = 1800;
// int rood_b = 1100;

int zwart_r = 20000;
int zwart_g = 20000;
int zwart_b = 20000;

int rood_r = 20000;
int rood_g = 20000;
int rood_b = 20000;

int groen_r = 750;
int groen_g = 500;
int groen_b = 800;

int blauw_r = 3000;
int blauw_g = 1700;
int blauw_b = 700;
/*
int licht_blauw_r = 700;
int licht_blauw_g = 500;
int licht_blauw_b = 500;

int roos_r = 400;
int roos_g = 700;
int roos_b = 500;

int geel_r = 400;
int geel_g = 500;
int geel_b = 450;

int wit_r = 400;
int wit_g = 500;
int wit_b = 450;
*/

void setup() {
  pinMode(LED_BUILTIN,OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);
  pinMode(blue_led,OUTPUT);
  pinMode(battery_led,OUTPUT);

  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(sensor, INPUT);

  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);

  digitalWrite(battery_led, HIGH);

  myServo.attach(servo_pin);

  Serial.begin(230400);
  Serial.setTimeout(1);
}

//Commands: 
//          Lxxxxxxxxx = RGB led followed with the values for the RGB LED
//          OL = Turn the builtin Led on or off
//          Cxxxxxxxxxxxxx = Change the parameters of the color sensor, the first x select the color, and the coresping 12 digits represent the actual values
//          DC = Detect color

void loop() {
  // put your main code here, to run repeatedly:
  while (!Serial.available());
  String x = Serial.readString();
  
  if(x.indexOf("L") == 0 && x.length() == 11) {
    int red = x.substring(1,4).toInt();
    int green = x.substring(4,7).toInt();
    int blue = x.substring(7,10).toInt();
    setLedColor(red, green, blue);
  } else if (x.indexOf("OL") == 0 && x.length() == 3) {
    if (built_in_led) {
      digitalWrite(LED_BUILTIN, LOW);
      built_in_led = false;
    } else {
      digitalWrite(LED_BUILTIN, HIGH);
      built_in_led = true;
    }
  } else if(x.indexOf("C") == 0 && x.length() == 15) {
    int color = x.substring(1,2).toInt();
    int red = x.substring(2,6).toInt();
    int green = x.substring(6,10).toInt();
    int blue = x.substring(10,14).toInt();
    changeParam(color, red, green, blue);
  } else if(x.indexOf("DC") == 0 && x.length() == 3) {
    readFromColorSensor();
    int result = detectColor();
    Serial.print(result);
    Serial.print("/");
    Serial.print(rood);
    Serial.print("/");
    Serial.print(groen);
    Serial.print("/");
    Serial.print(blauw);
    Serial.print("/");
  }  else if (x.indexOf("M") == 0 && x.length() == 2) {
    switchMotor();
  } else if (x.indexOf("S") == 0 && x.length() == 5) {
    int position = x.substring(1,4).toInt();
    setServoPosition(position);
  }

  Serial.println(x.length());
  Serial.flush();
  Serial.end();
  Serial.begin(230400);
}

void setLedColor(int r, int g, int b) {
  analogWrite(red_led, r);
  analogWrite(green_led, g);
  analogWrite(blue_led, b);
}

void readFromColorSensor() {
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  rood = pulseIn(sensor, LOW);

  digitalWrite(S2, HIGH);
  digitalWrite(S3, HIGH);
  groen = pulseIn(sensor, LOW);

  digitalWrite(S2, LOW);
  digitalWrite(S3, HIGH);
  blauw = pulseIn(sensor, LOW);
}

int detectColor() {
  if ((zwart_r != 20000) && (rood > zwart_r) && (groen >zwart_g) && (blauw > zwart_b)) {
    Serial.println(rood);
    Serial.println(zwart_r);
   return 0; //Zwart
  }
  else if ((rood_r != 20000) && (rood < rood_r) && (groen >rood_g) && (blauw > rood_b)) {
    return 1; //Rood
  }
  else if ((rood > groen_r) && (groen < groen_g) && (blauw > groen_b)) {
    return 2; //Groen
  }
  else if ((rood > blauw_r) && (groen < blauw_g) && (blauw <blauw_b)) {
    return 3; //Blauw
  }
  /*
  else if ((rood > licht_blauw_r) && (groen < licht_blauw_g) && (blauw <licht_blauw_b)) {
    return 4; //Licht Blauw
  }
  else if ((rood < roos_r) && (groen >roos_g) && (blauw <roos_b)) {
    return 5; //Roos
  }
  else if ((rood < geel_r) && (groen <geel_g) && (blauw >geel_b)) {
    return 6;//Geel
  }
  else if ((rood < wit_r) && (groen <wit_g) && (blauw <wit_b)) {
    return 7; //Wit
  }*/
  else {
    return 8; //Geen Idee
  }
}

void changeParam(int color, int red, int green, int blue) {
  if (color == 0) {
      zwart_r = red;
      zwart_g = green;
      zwart_b = blue;
  } else if (color == 1) {
      rood_r = red;
      rood_g = green;
      rood_b = blue;
  } else if (color == 2) {
      groen_r = red;
      groen_g = green;
      groen_b = blue;
  } else if (color == 3) {
      blauw_r = red;
      blauw_g = green;
      blauw_b = blue;
  } /* else if (color == 4) {
      licht_blauw_r = red;
      licht_blauw_g = green;
      licht_blauw_b = blue;
  } else if (color == 5) {
      roos_r = red;
      roos_g = green;
      roos_b = blue;
  } else if (color == 6) {
      geel_r = red;
      geel_g = green;
      geel_b = blue;
  } else if (color == 7) {
      wit_r = red;
      wit_g = green;
      wit_b = blue;
  }*/
}

void switchMotor() {
  if(motor_on) {
    analogWrite(motor,0);
    motor_on = false;
  } else {
    analogWrite(motor,100);
    motor_on = true;
  }
}

void setServoPosition(int position) {
  digitalWrite(battery_led, LOW);
  if(motor_on) {
    analogWrite(motor,0);
    motor_on = false;
  }
  if(position < 0) {
    position = 0;
  } else if (position > 180) {
    position = 180;
  }
  myServo.write(position);
  delay(200);
  digitalWrite(battery_led, HIGH);
}
