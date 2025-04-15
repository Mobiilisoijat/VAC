import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import axios from "axios"

const esp12sUrl = "http://192.168.4.1"

export default function App() {

  const [status, setStatus] = useState("Unknown")

  const sendCommand = async(command) => {
    try {
      const response = await axios.post(esp12sUrl, `command=${command}`, {
        headers:{
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 5000,
      })


      setStatus(response.data)

    }catch(error){
      if(axios.isAxiosError(error)) {
        if(error.code === "ECONNABORTED") {
          Alert.alert("Error","The request took too long. Please check your connection to ESP.")
        } else if(error.code === "Network Error") {
          Alert.alert("Error","Could not connect to esp. Please check your connection to ESP.")
        } else {
          Alert.alert("Error","There was a problem communicating with ESP.")
        }

      } else {
        Alert.alert("Error","An unexpected error occured.")
      }
    }

  }

  return (
    <View style={styles.container}>
      <Text>Paina nappeja</Text>

      <Button title="ON" onPress={() => sendCommand("ON")} />
      <Button title="OFF" onPress={() => sendCommand("OFF")} />

      <Button title="Check status" onPress={() => sendCommand("STATE")} />
      <Text>Lamp status: {status}</Text>
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
