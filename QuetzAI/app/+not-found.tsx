import  { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
    return (
        <>
        <Stack.Screen options={{ title: '¡Ooops! Pagina no encontrada' }} />
        <View style={styles.container}>
            <Link href="/" style={styles.button}>
                Go back to home screen!
            </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    textLogo1: {
      fontSize: 24,
      color: '#333',
      fontWeight: 'bold',
    },
    textLogo2: {
      fontSize: 24,
      color: '#008000',
      fontWeight: 'bold',
    },
    textInPlace: {
      fontSize: 18,
      color: '#333',
      fontWeight: 'bold',
    },
    logo: {
      width: 200,
      height: 200,
      alignContent: 'center',
    },
    input: {
      height: 40,
      width: 150,
      margin: 10,
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
    },
    button: {
      padding: 10,
      borderRadius: 0,
      borderWidth: 2,
      fontSize: 18,
      height: 45,
      width: 125,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  