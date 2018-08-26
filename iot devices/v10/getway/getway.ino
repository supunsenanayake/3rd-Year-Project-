
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define BACKLIGHT_PIN  13

const char address[4] = {'9', '9', '9', '9'};
String routingTable[5] = {"0001", "0002"};





int data_count = 0;
char Data[32] = "";
int AUX = 11;

//long previous = 0;
unsigned long currentMillis = 0;
void setup() {

  pinMode(AUX, INPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  digitalWrite(10, LOW);
  digitalWrite(11, LOW);
  Serial.begin(9600);
  Serial2.begin(9600);
  Serial3.begin(9600);

  currentMillis = millis();
}


bool pqr = true;

char  destinationArr[4];


int arrayIndex = 0;

char  sourceArr[4];

bool isGeatWayMassage = false;
char getwayMassage[32];
int getwayCount = 0;
String TTLValue;
void loop() {
  // int AUXState = digitalRead(AUX);
  int  n = 0;
  while (Serial2.available())
  {

    char x = Serial2.read();
    Serial.print(x);
    Serial.print("  arrayIndex=>>>>");
    Serial.println(arrayIndex);
    if (arrayIndex < 4) {
      destinationArr[arrayIndex] = x;
      arrayIndex++;

    }
    else if (arrayIndex < 8) {
      sourceArr[arrayIndex - 4] = x;
      arrayIndex++;
    }
    else if (x == '$' && arrayIndex == 8) {
      destinationArr[4] = '\0';
      if (String(destinationArr) == "9999") {
        //Serial.print("destinationArr= ");
        isGeatWayMassage = true;
        arrayIndex++;
      }
    }
    else if (isGeatWayMassage) {

      if (x == '@') {
        Serial.print("TTLValue---> ");
        Serial.println(TTLValue);
        int ttl = TTLValue.toInt();
        if (ttl > 0) {
          destinationArr[4] = '\0';
          Serial.print("destinationArr= ");
          Serial.print(String(destinationArr));
          Serial.print("  address= ");
          Serial.println(String(address));

          if ((String(destinationArr) == String(address))) {

            Serial.print("massage: ");
            Serial.println(String(getwayMassage));
            Serial.println("massage send as http request");


          }
        } else {
          Serial.println("massage Destroied ");
        }
        getwayCount = 0;
        arrayIndex = 0;
        isGeatWayMassage = false;
      }
      else if (arrayIndex == 9) {
        TTLValue = x;
        arrayIndex++;
      }
      else {
        getwayMassage[getwayCount] = x;
        getwayCount++;
      }
    }


  }

}



void SendTOGetWay(char data[], String sourceAddress, String getwayAddress, int TTLValue) {
  Serial.print("SendTOGetWay = ");
  Serial.print(data);
  Serial.print(" TTLValue= ");
  Serial.println(TTLValue);
  Serial2.print(getwayAddress);//getway address
  Serial2.print(sourceAddress);//source
  Serial2.print('$');//TTL Value available
  Serial2.print(String(TTLValue));//TTL Value

  Serial2.print(Data);//massage
  Serial2.print('@');

  Serial2.end();
  delay(300);
  Serial2.begin(9600);
  //Serial3.begin(9600);//----------
  delay(700);
  for (int i = 0; i < 32; i++) {
    Data[i] = '\0';
  }
}
void send(char data[], String sourceAddress, String destinationAddress) {
  Serial.print("send funtion");
  Serial.println(data);

  Serial2.print(destinationAddress);//destination
  Serial2.print(sourceAddress);//source
  Serial2.print(Data);//massage
  Serial2.print('@');

  Serial2.end();
  delay(300);
  Serial2.begin(9600);
  //Serial3.begin(9600);//----------
  delay(700);
  for (int i = 0; i < 32; i++) {
    Data[i] = '\0';
  }
}


bool SearchRoutingTable() {
  for (int i = 0; i < 5; i++) {
    if (routingTable[i] == "9999") {
      return true;
    }
  }
  return false;
}

