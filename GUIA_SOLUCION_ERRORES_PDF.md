# 🔧 Guía de Solución de Errores - Exportación PDF

## 🚨 **Errores Comunes y Soluciones**

### ❌ **Error 1: "No se encontró el contenido de la cotización"
**Causa:** El elemento con id="cotizacion-content" no existe
**Solución:** 
- Verificar que el div de vista previa esté visible
- Agregar al menos un item antes de exportar
- Recargar la página si el problema persiste

### ❌ **Error 2: "Por favor, agregue al menos un item"
**Causa:** Intentando exportar sin items en la cotización
**Solución:**
- Agregar al menos un item con descripción, cantidad y precio
- Verificar que el item se guardó correctamente
- Intentar exportar nuevamente

### ❌ **Error 3: Error de jsPDF o html2canvas**
**Causa:** Problemas con las librerías de generación de PDF
**Solución:**
- Verificar la consola del navegador para detalles específicos
- Recargar la página para limpiar caché
- Usar un navegador diferente (Chrome/Firefox)

### ❌ **Error 4: "Error al generar el PDF"
**Causa:** Error en el proceso de conversión a PDF
**Solución:**
- Verificar el mensaje completo en la alerta
- Revisar que los datos no contengan caracteres especiales
- Intentar con una cotización más simple

## 🔧 **Pasos para Diagnosticar el Problema**

### 1. **Revisar la Consola del Navegador**
```
1. Presionar F12
2. Ir a la pestaña "Console"
3. Intentar exportar el PDF
4. Buscar mensajes de error en rojo
```

### 2. **Verificar Elementos Requeridos**
```javascript
// En la consola del navegador, ejecutar:
console.log('Items:', items.length);
console.log('Elemento:', document.getElementById('cotizacion-content'));
```

### 3. **Probar con Datos Simples**
- Agregar solo 1 item simple
- Usar descripción sin caracteres especiales
- Precio unitario sin decimales

### 4. **Verificar Compatibilidad**
- **Chrome:** Generalmente funciona mejor
- **Firefox:** Buena compatibilidad
- **Safari:** Puede requerir permisos adicionales
- **Edge:** Compatible con Chrome

## 🛠️ **Solución Temporal (si persiste el error)**

### Opción A: Recargar la Página
1. Guardar los datos actuales (tomar nota)
2. Recargar la página: F5
3. Ingresar nuevamente los datos
4. Intentar exportar

### Opción B: Usar Navegador Incógnito
1. Abrir ventana incógnito
2. Ir a la aplicación
3. Configurar cotización simple
4. Intentar exportar

### Opción C: Limpiar Caché
1. Limpiar caché del navegador
2. Cerrar todas las pestañas del sitio
3. Abrir nueva pestaña limpia
4. Configurar y exportar

## 📞 **Si el Problema Persiste**

Por favor, proporciona:
1. **El error completo** que aparece en la alerta
2. **El navegador** que estás usando
3. **El mensaje exacto** de la consola (si hay)
4. **Pasos que seguiste** antes del error

Con esta información podré identificar y solucionar el problema específico rápidamente.