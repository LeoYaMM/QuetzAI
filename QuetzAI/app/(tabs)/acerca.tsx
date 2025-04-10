import { Text, View, StyleSheet } from "react-native";

export default function AboutScreen(){
    return (
        <View style={styles.container}>
            <Text style={styles.textInPlace}>Somos un par de estudiantes de la ingeniería en inteligencia artificial de la ESCOM. 
                Este proyecto fue realizado como parte de la materia de desarrollo de software. El cual fue expandiendose a lo largo de la carrera.
                Y ahora se ha convertido en una herramienta para ayudar a los museos a digitalizar sus colecciones y hacerlas accesibles al público.
            </Text>
        </View>
    )
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
  