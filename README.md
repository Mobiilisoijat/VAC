# Vaka-varma (VAC)

Vaka-varma (VAC) is our library-access guard service. Using our KirjastoKännykkä application the user may enter through a library gate operated by VAC. 

VAC uses a QR-code generated in KirjastoKännykkä application for every registered user. 
This could be used in the future for denying access to certain users or perhaps gathering data on how many visitors a certain library gets.
![IMG_3563](https://github.com/user-attachments/assets/6d20c58a-5f8a-4d90-9dba-faa0037dd4c6)


### COMPONENTS REQUIRED:
- ESP8266 platform with WiFi capabilities (I used Feather Huzzah 8266 WiFi)
- a motor ( I used a lego technic M motor https://en.brickimedia.org/wiki/8883_Power_Functions_M-Motor )
- a secondary phone or an emulator to run react native off of (needed for reading the qr code, main phone(or emulator) should have the KirjastoKännykkä application running with the "Näytä QR-koodi" screen open)
- Regular NPN transistor if using ESP to power the motor
