/* @file CustomKeypad.pde
  || @version 1.0
  || @author Alexander Brevig
  || @contact alexanderbrevig@gmail.com
  ||
  || @description
  || | Demonstrates changing the keypad size and key values.
  || #
*/
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define BACKLIGHT_PIN     13



LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE); // Set the LCD I2C address



#include <Keypad.h>

const byte ROWS = 4; //four rows
const byte COLS = 4; //four columns
//define the cymbols on the buttons of the keypads
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'H', 'E', 'L', 'B'},
  {'R', 'W', 'O', 'C'},
  {' ', '0', 'D', 'E'}
};
byte rowPins[ROWS] = {2, 3, 4, 5}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {6, 7, 8, 9}; //connect to the column pinouts of the keypad

//initialize an instance of class NewKeypad
Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins , colPins, ROWS, COLS);

int data_count = 0;
char Data[32] = "";
void setup() {
  lcd.begin(16, 2);
  lcd.backlight();
  Serial.begin(9600);
  Serial2.begin(57600);
  Serial3.begin(9600);
}

void loop() {
 /* if (Serial2.available()) {
    char x = Serial2.read();
    delay(2000);
    Serial.print("t");
    Serial.print(x);
    lcd.setCursor(0, 0);
    lcd.print(x);
   // Serial.print("/n"); 
    
    
  }*/

int  n=0;
while(Serial2.available())
{
    
    char x = Serial2.read();
    delay(2);
    //Serial.print("t");
    if(isAlphaNumeric(x)||(x==' ')){
      Serial.print(x);
      lcd.setCursor(n, 0);
    n++;
    lcd.print(x);
      } 
}  
  char customKey = customKeypad.getKey();
  if (customKey) {
    //delete char at a time
    if (customKey == 'B') {
      Serial.println("delete");
      Serial.print("A datacount=");
      Serial.println(data_count);
      data_count = data_count - 1;
      if (data_count < 16) {
        lcd.setCursor(data_count, 0);
        lcd.print(" ");
        Data[data_count] = '\0';

      }
      else {
        lcd.setCursor(data_count - 16, 1);
        lcd.print(" ");
        Data[data_count] = '\0';
      }
    }
    else if (customKey == 'A') {
      send();
      data_count = 0;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Massage Send...");
      delay(1000);
      lcd.clear();
    }
    else {
      if (data_count < 32) {
        Serial.println(customKey);
        if (data_count < 16) {
          lcd.setCursor(data_count, 0);
          Data[data_count] = customKey;

        }
        else {
          lcd.setCursor(data_count - 16, 1);
          Data[data_count] = customKey;

        }
        lcd.print(customKey);
        data_count++;
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
        int temp=data_count;//-------------
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
          data_count=temp;//------
        }
      }

    }
  }
}

void send() {
  Serial.println(Data);
  Serial2.println(Data);
  Serial3.println(Data);//--------
  Serial3.end();//-------
  Serial2.end();
  delay(30);
  Serial2.begin(57600);
  Serial3.begin(9600);//----------
  delay(700);
  for (int i = 0; i <= 32; i++) {
    Data[i] = '\0';
  }
}


