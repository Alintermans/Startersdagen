#include <Servo.h>

#define SERVO_PIN 5

Servo myServo;
bool done = false;


void setup() {
done = false;
myServo.attach(SERVO_PIN);
delay(500);
}

void loop() {
  if(!done) {
    myServo.write(40);
    delay(1000);
    myServo.write(140);
    done = true;
  }
}