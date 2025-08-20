import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para guardar el id en el dispositivo
export async function guardarIdVisitante(id) {
  try {
    await AsyncStorage.setItem('id_visitante', id.toString());
    console.log('ID guardado correctamente');
  } catch (error) {
    console.error('Error guardando el ID: ', error);
  }
}

// Función para recuperar el id desde el dispositivo
export async function obtenerIdVisitante() {
  try {
    const id = await AsyncStorage.getItem('id_visitante');
    if (id !== null) {
      return id;
    }
    return null;
  } catch (error) {
    console.error('Error leyendo el ID: ', error);
  }
}

// Función para enviar los datos al servidor
export async function iniciarRegistro(nombre, edad) {
  const resultado = await registrarVisitante(nombre, edad);
  if (resultado && resultado.id_visitante) {
    await guardarIdVisitante(resultado.id_visitante);
    return true; // Éxito
  } else {
    console.error('No se pudo registrar al visitante.');
    return false; // Fallo
  }
}

// Función para enviar los datos al servidor
export async function registrarVisitante(nombre, edad) {
  try {
    const response = await fetch('http://10.0.2.2:8000/registrar_visitante', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nombre, edad}),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error al registrar el visitante: ', error);
    return null;
  }
}
