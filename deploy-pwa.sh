#!/bin/bash

# 🍎 Script para convertir la app web en PWA para iPad
echo "🌞 Convirtiendo Calculadora Solar en PWA para iPad..."

# Paso 1: Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json. Ejecuta este script en la raíz del proyecto."
    exit 1
fi

# Paso 2: Instalar dependencias necesarias
echo "📦 Instalando dependencias..."
npm install

# Paso 3: Construir para producción
echo "🔨 Construyendo para producción..."
npm run build

# Paso 4: Verificar archivos PWA
echo "✅ Verificando archivos PWA..."
if [ -f "public/manifest.json" ]; then
    echo "✅ manifest.json encontrado"
else
    echo "❌ manifest.json no encontrado"
fi

if [ -f "public/sw.js" ]; then
    echo "✅ sw.js encontrado"
else
    echo "❌ sw.js no encontrado"
fi

# Paso 5: Iniciar servidor de producción local
echo "🚀 Iniciando servidor de producción..."
echo "📱 Para instalar en iPad:"
echo "1. Conecta tu iPad a la misma red WiFi"
echo "2. Abre Safari y ve a: http://localhost:3000"
echo "3. Toca el botón compartir → 'Agregar a pantalla de inicio'"
echo "4. Listo! 🎉"

npm start