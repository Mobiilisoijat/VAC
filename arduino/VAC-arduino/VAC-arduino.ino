#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char *AP_SSID = "ESP12S_Wifi_network";
const char *AP_Password = "12345678";
const int Relay_PIN = 0; //Used as a motor pin simultaneously

IPAddress AP_IP(192, 168, 4, 1);
IPAddress AP_Subnet(255, 255, 255, 0);

ESP8266WebServer server(80);
String State = "CLOSED";

void setup() {

  pinMode(Relay_PIN, OUTPUT);
  digitalWrite(Relay_PIN, LOW);


  WiFi.softAPConfig(AP_IP, AP_IP, AP_Subnet);
  WiFi.softAP(AP_SSID, AP_Password);

  server.on("/", handleRoot);
  server.begin();
}

void openDoor() {

  State = "OPEN";
  digitalWrite(Relay_PIN, HIGH);
  server.send(200, "text/plain", "OPEN");
  delay(80);  //OPENING SEQUENCE
  digitalWrite(Relay_PIN, LOW);
}

void closeDoor() {
  State = "CLOSED";  //Turn motor back to original state: Closed
  digitalWrite(Relay_PIN, HIGH);
  //delay(135);  //CLOSING SEQUENCE
  delay(500); //Perfect delay to make a loop: gate door returns to place where it can be used opened again from
  digitalWrite(Relay_PIN, LOW);
  server.send(200, "text/plain", "CLOSED");
}

void loop() {
  server.handleClient();
}

void handleRoot() {

  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
  } else {

    String command = server.arg("command");

    if (command == "OPEN") {
      openDoor();
      delay(10000);  //HOLD DOOR OPEN -SEQUENCE
      closeDoor();
    }

    else if (command == "CLOSED") {
      State = "CLOSED";
      digitalWrite(Relay_PIN, LOW);
      server.send(200, "text/plain", "CLOSED");
    }

    else if (command == "STATE") {
      server.send(200, "text/plain", State);
    } else {
      server.send(400, "text/plain", "Invalid Command");
    }
  }
}
