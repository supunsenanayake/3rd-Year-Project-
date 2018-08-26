
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define BACKLIGHT_PIN  13

const char address[4] = {'0','0','0','2'};

LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE); // Set the LCD I2C address



#include <Keypad.h>

const byte ROWS = 4; //four rows
const byte COLS = 4; //four columns
//define the cymbols on the buttons of the keypads
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {' ', '0', '#', 'D'}
};
byte rowPins[ROWS] = {2, 3, 4, 5}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {6, 7, 8, 9}; //connect to the column pinouts of the keypad

//initialize an instance of class NewKeypad
Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins , colPins, ROWS, COLS);

int data_count = 0;
char Data[32] = "";
int AUX = 11;
int isMsgDisplay = 0;
int isTypingMsg = 0;
long previous = 0;
unsigned long currentMillis = 0;
void setup() {

  pinMode(AUX, INPUT);
  lcd.begin(16, 2);
  lcd.backlight();
  Serial.begin(9600);
  Serial2.begin(9600);
  Serial3.begin(9600);

  currentMillis = millis();
}


bool pqr = true;

char  destinationArr[4];
int destinationArrIndex=0;
String destinationz="not";

char  sourceArr[4];
String sourcez="not";
int sourceArrIndex=0;

bool xxx=false;
void loop() {
  // int AUXState = digitalRead(AUX);
  int  n = 0;
  while (Serial2.available())
  {
    if (isTypingMsg == 1) {
      isTypingMsg = 0;
      clearDisplayRemainPart(0);
    }
    char x = Serial2.read();
    Serial.println(x);
    //if massage  reserved should display only the massage  is reserved
    if (x == '$') {
      destinationz="start";
      sourcez="not";
      
    }
    if(destinationz=="start"){
      destinationArr[destinationArrIndex]=x;
      destinationArrIndex++;
      
      }
    if(x=='*'){
      destinationz="end";
      sourcez="start";
    
      }
    if(sourcez=="start"){
      sourceArr[sourceArrIndex]=x;
      sourceArrIndex++;
      
      }
    if (x == '!') {
      sourcez="end";
      destinationz="end";
      xxx=true;
    
      
    }
    
    //delay(2);
    //Serial.print("t");
    Serial.print("end=");
      Serial.println(destinationz);
      Serial.print("source=");
      Serial.println(sourcez);
    if (xxx&&(isAlphaNumeric(x) || (x == ' '))) {
      
      if (n <= 15) {
        lcd.setCursor(n, 0);
        delay(30);//if we did not put if input=1 not display
      }
      else {

        lcd.setCursor(n - 16, 1);
        delay(30);//if we did not put if input=1 not display
      }
      // lcd.setCursor(n, 0);
      n++;
      lcd.print(x);
    }
    if (x == '@') {
      clearDisplayRemainPart(n);
      isMsgDisplay = 1;
      destinationz="not";
      sourcez="not";
    }
    
  }
  char customKey = customKeypad.getKey();
  
}

 

void clearDisplayRemainPart(int coloum) {
  for (int i = coloum; i < 32; i++) {
    if (i <= 15) {
      lcd.setCursor(i, 0);
    }
    else {
      lcd.setCursor(i - 16, 1);
    }
    lcd.print(' ');
  }
}
void printLcdDisplay(char customKey , int data_count) {

  if (data_count < 32) {
   // Serial.println(customKey);
    if (data_count < 16) {
      lcd.setCursor(data_count, 0);
      Data[data_count] = customKey;

    }
    else {
      lcd.setCursor(data_count - 16, 1);
      Data[data_count] = customKey;

    }
    lcd.print(customKey);
    //data_count++;
    // delay(1000);
    // lcd.clear();
    // delay(80);
  }
  else {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sorry massage ");
    lcd.setCursor(0, 1);
    lcd.print("too long..");
    Serial.print("B & datacount=");
    Serial.println(data_count);
    int temp = data_count; //-------------
    Data[data_count] = '\n';
    //data_count--;
    // Serial.print("B datacount=");
    //Serial.println(data_count);
    delay(1000);
    lcd.clear();

    for (int i = 0; i < 32; i++) {
      if (i < 16) {
        lcd.setCursor(i, 0);
        lcd.print(Data[i]);
      }
      else {
        lcd.setCursor(i - 16, 1);
        lcd.print(Data[i]);
      }
      data_count = temp; //------
    }
  }

}


