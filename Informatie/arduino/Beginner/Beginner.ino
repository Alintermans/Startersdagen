int S0 = 4;
int S1 = 45;
int S2 = 44;
int S3 = 46;
int sensor = 48;

int rood = 0;
int groen = 0;
int blauw = 0;

int zwart_r = 4500;
int zwart_g = 7000;
int zwart_b = 6500;

int rood_r = 400;
int rood_g = 1800;
int rood_b = 1100;

int groen_r = 750;
int groen_g = 500;
int groen_b = 800;

int blauw_r = 3000;
int blauw_g = 1700;
int blauw_b = 700;

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




void setup() {
  // put your setup code here, to run once:
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(sensor, INPUT);

  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:


  if ((rood > zwart_r) && (groen >zwart_g) && (blauw > zwart_b)) {
    Serial.println(" Zwart");
  }
  else if ((rood < rood_r) && (groen >rood_g) && (blauw > rood_b)) {
    Serial.println("Rood");
  }
  else if ((rood > groen_r) && (groen < groen_g) && (blauw > groen_b)) {
    Serial.println("Groen");
  }
  else if ((rood > blauw_r) && (groen < blauw_g) && (blauw <blauw_b)) {
    Serial.println("Blauw");
  }
  else if ((rood > licht_blauw_r) && (groen < licht_blauw_g) && (blauw <licht_blauw_b)) {
    Serial.println("Licht blauw");
  }
  else if ((rood < roos_r) && (groen >roos_g) && (blauw <roos_b)) {
    Serial.println("Roos");
  }
  else if ((rood < geel_r) && (groen <geel_g) && (blauw >geel_b)) {
    Serial.println("Geel");
  }
  else if ((rood < wit_r) && (groen <wit_g) && (blauw <wit_b)) {
    Serial.println("Wit");
  }
  else {
    Serial.println("geen idee");
  }


  // if ((rood > 4500) && (groen >7000) && (blauw > 6500)) {
  //   Serial.println(" Zwart");
  // }
  // else if ((rood < 400) && (groen >1800) && (blauw > 1100)) {
  //   Serial.println("Rood");
  // }
  // else if ((rood > 750) && (groen < 500) && (blauw > 800)) {
  //   Serial.println("Groen");
  // }
  // else if ((rood > 3000) && (groen < 1700) && (blauw <700)) {
  //   Serial.println("Blauw");
  // }
  // else if ((rood > 700) && (groen < 500) && (blauw <500)) {
  //   Serial.println("Licht blauw");
  // }
  // else if ((rood < 400) && (groen >700) && (blauw <500)) {
  //   Serial.println("Roos");
  // }
  // else if ((rood < 400) && (groen <500) && (blauw >450)) {
  //   Serial.println("Geel");
  // }
  // else if ((rood < 400) && (groen <500) && (blauw <450)) {
  //   Serial.println("Wit");
  // }
  // else {
  //   Serial.println("geen idee");
  // }
  Serial.print(rood);
  Serial.print(" ");
  Serial.print(groen);
  Serial.print(" ");
  Serial.println(blauw);
  delay(500);
}
