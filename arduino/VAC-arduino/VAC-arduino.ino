#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char *AP_SSID = "ESP12S_Wifi_network";
const char *AP_Password = "12345678";
const int Relay_PIN = 0;
const int Motor_PIN = 14;

IPAddress AP_IP(192,168,4,1);
IPAddress AP_Subnet(255,255,255,0);

ESP8266WebServer server(80);
String State = "OFF";

void setup() {

  pinMode(Relay_PIN, OUTPUT);
  digitalWrite(Relay_PIN, HIGH);
  pinMode(Motor_PIN, OUTPUT);
  digitalWrite(Motor_PIN, HIGH);

  WiFi.softAPConfig(AP_IP, AP_IP, AP_Subnet);
  WiFi.softAP(AP_SSID, AP_Password);

  server.on("/", handleRoot);
  server.begin();

}

void loop() {
  server.handleClient();

}

void handleRoot() {
  if(server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
  } else {
    
    String command = server.arg("command");

    if(command == "ON") {
      State = "ON";
      digitalWrite(Relay_PIN, LOW);
      digitalWrite(Motor_PIN, LOW);
      server.send(200, "text/plain", "ON");
    }

    else if(command == "OFF"){
      State = "OFF";
      digitalWrite(Relay_PIN, HIGH);
      digitalWrite(Motor_PIN, HIGH);
      server.send(200, "text/plain", "OFF");
    }

    else if(command == "STATE"){
      server.send(200, "text/plain", State);
    } else {
      server.send(400, "text/plain", "Invalid Command");
    }
  }
}






