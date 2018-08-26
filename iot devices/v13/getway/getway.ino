
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define BACKLIGHT_PIN  13

const char address[4] = {'9', '9', '9', '9'};
String routingTable[5] = {"0001", "0002"};





int data_count = 0;
char Data[32] = "";
//int AUX = 11;

//long previous = 0;
unsigned long currentMillis = 0;

//http request
#include <SoftwareSerial.h>
SoftwareSerial GSM(10, 11);
enum _parseState {
  PS_DETECT_MSG_TYPE,

  PS_IGNORING_COMMAND_ECHO,

  PS_HTTPACTION_TYPE,
  PS_HTTPACTION_RESULT,
  PS_HTTPACTION_LENGTH,

  PS_HTTPREAD_LENGTH,
  PS_HTTPREAD_CONTENT
};

byte parseState = PS_DETECT_MSG_TYPE;
char buffer[80];
byte pos = 0;

int contentLength = 0;

void resetBuffer() {
  memset(buffer, 0, sizeof(buffer));
  pos = 0;
}

void sendGSM(const char* msg, int waitMs = 500) {
  GSM.println(msg);
  delay(waitMs);
  while (GSM.available()) {
    parseATText(GSM.read());
  }
}

//------------------------------
void setup() {

  // pinMode(AUX, INPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  digitalWrite(2, LOW);
  digitalWrite(3, LOW);
  Serial.begin(9600);
  Serial2.begin(9600);
  Serial3.begin(9600);

  currentMillis = millis();

  //http request
  GSM.begin(9600);
  //Serial.begin(9600);



  //-------------
}


bool pqr = true;

char  destinationArr[4];


int arrayIndex = 0;

char  sourceArr[4];
String preeMsgSoursAddress;
bool isGeatWayMassage = false;
char getwayMassage[32];
int getwayCount = 0;
String TTLValue;
String preeMsgId = "null"; //preevious message id
String CurrentMsgId;//current message id

void loop() {
  while (GSM.available()) {
    parseATText(GSM.read());
  }

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
        
        if ((ttl > 0)) {

          
          destinationArr[4] = '\0';
          Serial.print("destinationArr= ");
          Serial.print(String(destinationArr));
          Serial.print("  address= ");
          Serial.println(String(address));

          if ((String(destinationArr) == String(address))) {

            Serial.print("massage: ");
            Serial.println(String(getwayMassage));

            Serial.print("Previous Message SoursAddress=");
            Serial.print(preeMsgSoursAddress);
            Serial.print(" current Message SoursAddress=");
            sourceArr[4]='\0';
            Serial.println(String(sourceArr));
            if (preeMsgSoursAddress == String(sourceArr)) {
              Serial.print("Previous Message id=");
            Serial.print(preeMsgId);
            Serial.print(" current Message id=");
            Serial.println(CurrentMsgId);
              if (preeMsgId != CurrentMsgId) {
                preeMsgId = CurrentMsgId;
                Serial.println("massage send as http request");
                sourceArr[4] = '\0';
                sendHttpRequest(String(getwayMassage), String(sourceArr));
                preeMsgSoursAddress = String(sourceArr);
              }
              else{
                Serial.println(" destroyed message due to same message repeat");
                }
            } else {
              
              Serial.println("massage send as http request");
              sourceArr[4] = '\0';
              sendHttpRequest(String(getwayMassage), String(sourceArr));
              preeMsgSoursAddress = String(sourceArr);
              preeMsgId = CurrentMsgId;
            }



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
      else if (arrayIndex == 10) {
        CurrentMsgId = x;
        arrayIndex++;
      }
      else {
        if (x == ' ') { //%20
          getwayMassage[getwayCount] = '%' ;
          getwayCount++;
          getwayMassage[getwayCount] = '2' ;
          getwayCount++;
          getwayMassage[getwayCount] = '0' ;
          getwayCount++;
        } else {
          getwayMassage[getwayCount] = x;
          getwayCount++;
        }

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

//http request
void parseATText(byte b) {

  buffer[pos++] = b;

  if ( pos >= sizeof(buffer) )
    resetBuffer(); // just to be safe

  /*
    // Detailed debugging
    Serial.println();
    Serial.print("state = ");
    Serial.println(state);
    Serial.print("b = ");
    Serial.println(b);
    Serial.print("pos = ");
    Serial.println(pos);
    Serial.print("buffer = ");
    Serial.println(buffer);*/

  switch (parseState) {
    case PS_DETECT_MSG_TYPE:
      {
        if ( b == '\n' )
          resetBuffer();
        else {
          if ( pos == 3 && strcmp(buffer, "AT+") == 0 ) {
            parseState = PS_IGNORING_COMMAND_ECHO;
          }
          else if ( b == ':' ) {
            //Serial.print("Checking message type: ");
            //Serial.println(buffer);

            if ( strcmp(buffer, "+HTTPACTION:") == 0 ) {
              Serial.println("Received HTTPACTION");
              parseState = PS_HTTPACTION_TYPE;
            }
            else if ( strcmp(buffer, "+HTTPREAD:") == 0 ) {
              Serial.println("Received HTTPREAD");
              parseState = PS_HTTPREAD_LENGTH;
            }
            resetBuffer();
          }
        }
      }
      break;

    case PS_IGNORING_COMMAND_ECHO:
      {
        if ( b == '\n' ) {
          Serial.print("Ignoring echo: ");
          Serial.println(buffer);
          parseState = PS_DETECT_MSG_TYPE;
          resetBuffer();
        }
      }
      break;

    case PS_HTTPACTION_TYPE:
      {
        if ( b == ',' ) {
          Serial.print("HTTPACTION type is ");
          Serial.println(buffer);
          parseState = PS_HTTPACTION_RESULT;
          resetBuffer();
        }
      }
      break;

    case PS_HTTPACTION_RESULT:
      {
        if ( b == ',' ) {
          Serial.print("HTTPACTION result is ");
          Serial.println(buffer);
          parseState = PS_HTTPACTION_LENGTH;
          resetBuffer();
        }
      }
      break;

    case PS_HTTPACTION_LENGTH:
      {
        if ( b == '\n' ) {
          Serial.print("HTTPACTION length is ");
          Serial.println(buffer);

          // now request content
          GSM.print("AT+HTTPREAD=0,");
          GSM.println(buffer);

          parseState = PS_DETECT_MSG_TYPE;
          resetBuffer();
        }
      }
      break;

    case PS_HTTPREAD_LENGTH:
      {
        if ( b == '\n' ) {
          contentLength = atoi(buffer);
          Serial.print("HTTPREAD length is ");
          Serial.println(contentLength);

          Serial.print("HTTPREAD content: ");

          parseState = PS_HTTPREAD_CONTENT;
          resetBuffer();
        }
      }
      break;

    case PS_HTTPREAD_CONTENT:
      {
        // for this demo I'm just showing the content bytes in the serial monitor
        Serial.write(b);

        contentLength--;

        if ( contentLength <= 0 ) {

          // all content bytes have now been read

          parseState = PS_DETECT_MSG_TYPE;
          resetBuffer();
        }
      }
      break;
  }
}

void sendHttpRequest(String msg, String senderAddress) {
  sendGSM("AT+SAPBR=3,1,\"APN\",\"MOBITEL3G\"");
  sendGSM("AT+SAPBR=1,1", 3000);
  sendGSM("AT+HTTPINIT");
  sendGSM("AT+HTTPPARA=\"CID\",1");
  String address = senderAddress;
  String mesage = msg;
  String url = "AT+HTTPPARA=\"URL\",\"http://18.221.166.17/device/msg/" + mesage + "/" + address + "\"";
  char charBuf[100];
  url.toCharArray(charBuf, 100);
  sendGSM(charBuf);
  sendGSM("AT+HTTPACTION=0");
}
//-------------------
