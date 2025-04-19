import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import axios from "axios"
import { Camera, CameraView } from 'expo-camera';

const esp12sUrl = "http://192.168.4.1"

export default function App() {

  const [status, setStatus] = useState("Unknown") //Status of arduino side
  // Camera reading functionality

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [data, setData] = useState('')

  

  const askForCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }
  useEffect(() => {
    askForCameraPermission()
  }, [])

  const handleQRCodeScan = ({type, data}) => {
    setScanned(true)
    console.log(`Type: ${type} \nData: ${data}`)
    if(data.length == 28 && type == "qr"){  //Without internet access, this is enough for now (user UID length)
      setData(data)
      console.log("QR-koodinluku onnistui!") //Motor should turn on: change command back to OFF when a certain time passes on arduino side
      sendCommand("OPEN") // and handle turning motor so the gate is closed again
      
    } else{
      setData("Vääränlainen tieto luettu:"+data)
    }
    setTimeout(() => {setScanned(false)}, 3000)
  }

  // Command sending functionality for arduino via WiFi connection
  const sendCommand = async (command) => {
    try {
      const response = await axios.post(esp12sUrl, `command=${command}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 5000,
      })


      setStatus(response.data)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          Alert.alert("Error", "The request took too long. Please check your connection to ESP.")
        } else if (error.code === "Network Error") {
          Alert.alert("Error", "Could not connect to esp. Please check your connection to ESP.")
        } else {
          Alert.alert("Error", "There was a problem communicating with ESP.")
        }

      } else {
        Alert.alert("Error", "An unexpected error occured.")
      }
    }

  }

  // handle permissions for camera usage
  if(hasPermission === null) {
    return(
      <View style={styles.container}>
        <Text>Pyydetään lupaa käyttää kameraa</Text>
      </View>
    )
  }
  if(hasPermission === false) {
    return(
      <View style={styles.container}>
        <Text>Ei lupaa käyttää kameraa</Text>
        <Button onPress={() => askForCameraPermission()} title="Pyydä lupaa käyttää kameraa"/>
      </View>
    )
  }
  // Camera view for scanning and buttons to manually alter accessgate's state
  return (
    <View style={styles.container}>

      <View>
        <CameraView 
          onBarcodeScanned={scanned ? undefined : handleQRCodeScan}
          style={{height: 500, width: 500}}
        />
      </View>
      <Text>{data}</Text>



      
      <Text>Päivitä portin asento manuaalisesti</Text>

      <Button title="OPEN" onPress={() => sendCommand("OPEN")} />
      <Button title="CLOSED" onPress={() => sendCommand("CLOSED")} />

      <Button title="Check status" onPress={() => sendCommand("STATE")} />
      <Text>Pääsyportin tila: {status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
