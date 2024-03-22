import { CameraView, useCameraPermissions, Camera } from 'expo-camera/next';
import { StyleSheet, View, Image, TouchableOpacity, Text, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';


const cameraIcon = require('../../assets/icons/Swith_Camera.png');

export default function CameraArea() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    alert(`${data}`);
  };

  if (hasPermission === null) {
    return <Text>Precisa da permissão da camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  if (!permission) {
    requestPermission();
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Image source={cameraIcon} style={styles.cameraIcon} />
        </TouchableOpacity>
      </CameraView>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      <StatusBar styles="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    height: '70%',
  },
  cameraIcon: {
    width: 80,
    height: 80,
    margin: 20,
  },

});
