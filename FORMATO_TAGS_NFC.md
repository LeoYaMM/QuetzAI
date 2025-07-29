# 📱 Formato de Tags NFC para Artefactos del Museo

## 🎯 Propósito

Los tags NFC deben contener información sobre los artefactos del museo que los visitantes pueden escanear para obtener detalles históricos y culturales.

## 📝 Formato de Datos Recomendado

### Opción 1: Formato JSON (Recomendado)

```json
{
  "nombre": "Vasija Maya Ceremonial",
  "descripcion": "Esta vasija fue utilizada en ceremonias religiosas por los antiguos mayas. Sus intrincados diseños representan deidades y símbolos sagrados que conectaban el mundo terrenal con el espiritual.",
  "epoca": "Período Clásico Maya (250-900 d.C.)",
  "origen": "Petén, Guatemala",
  "material": "Cerámica policromada"
}
```

### Opción 2: Texto Plano (Alternativo)

```
Máscara de Jade Olmeca - Esta máscara representa el poder divino de los gobernantes olmecas. Fue tallada en jade verde, piedra considerada más valiosa que el oro para las civilizaciones mesoamericanas.
```

## 🏺 Ejemplos de Artefactos

### Ejemplo 1: Escultura
```json
{
  "nombre": "Cabeza Colosal Olmeca",
  "descripcion": "Monumental escultura que representa a un gobernante olmeca. Estas cabezas demuestran el avanzado conocimiento artístico y técnico de la civilización olmeca, considerada la 'cultura madre' de Mesoamérica.",
  "epoca": "1200-600 a.C.",
  "origen": "La Venta, Tabasco",
  "material": "Basalto volcánico"
}
```

### Ejemplo 2: Codice
```json
{
  "nombre": "Códice Dresde (Réplica)",
  "descripcion": "Uno de los pocos códices mayas que sobrevivieron a la conquista española. Contiene conocimientos astronómicos, matemáticos y rituales de extraordinaria precisión.",
  "epoca": "Siglo XI-XII d.C.",
  "origen": "Península de Yucatán",
  "material": "Papel de corteza de árbol"
}
```

### Ejemplo 3: Textil
```json
{
  "nombre": "Huipil Ceremonial Zapoteca",
  "descripcion": "Vestimenta tradicional femenina con diseños geométricos que representan elementos de la naturaleza y cosmovisión zapoteca. Cada patrón tiene un significado específico transmitido de generación en generación.",
  "epoca": "Siglo XIX",
  "origen": "Oaxaca, México",
  "material": "Algodón teñido con tintes naturales"
}
```

## 🔧 Características Técnicas

### Campos Obligatorios
- **nombre**: Nombre del artefacto
- **descripcion**: Información detallada sobre el objeto

### Campos Opcionales
- **epoca**: Período histórico o fecha
- **origen**: Lugar de procedencia
- **material**: Material de construcción
- **cultura**: Civilización o cultura de origen
- **uso**: Función o propósito del objeto
- **dimensiones**: Medidas del artefacto
- **conservacion**: Estado de conservación

## 💡 Consejos para la Creación de Tags

1. **Longitud**: Mantén las descripciones entre 100-300 caracteres para mejor legibilidad
2. **Lenguaje**: Usa un lenguaje accesible pero educativo
3. **Contexto**: Incluye información que conecte el artefacto con su época y cultura
4. **Emocional**: Agrega elementos que generen interés y curiosidad
5. **Formato**: Prefiere JSON para datos estructurados, texto plano para información simple

## 📲 Cómo Funciona en la App

1. El usuario navega a la pantalla NFC
2. Acerca su dispositivo al tag del artefacto
3. La app lee automáticamente la información
4. Se muestra una tarjeta con todos los detalles
5. El usuario puede leer la información completa
6. Puede continuar escaneando otros artefactos

## 🎨 Mejoras Futuras Sugeridas

- Agregar imágenes de los artefactos
- Incluir audio con pronunciación de nombres
- Añadir enlaces a información adicional
- Integrar realidad aumentada
- Crear tours guiados basados en NFC
