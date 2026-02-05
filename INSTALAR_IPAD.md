# 📱 Guía Rápida: Instalar App en iPad

## 🌟 Método PWA (Recomendado - 5 minutos)

### Paso 1: Publicar la App
```bash
# Opción A: Vercel (Gratis y fácil)
npx vercel --prod

# Opción B: Netlify (También gratis)
npm run build
# Sube la carpeta .next a Netlify
```

### Paso 2: Instalar en iPad
1. 📱 Abre **Safari** en tu iPad
2. 🌐 Ve a la URL que te dio Vercel/Netlify
3. 📤 Toca el botón **Compartir** (icono de cuadro con flecha)
4. 📱 Selecciona **"Agregar a pantalla de inicio"**
5. ✅ Toca **"Agregar"**

### Paso 3: ¡Listo!
- Busca el ícono **"Solar Calc Pro"** en tu iPad
- Ábrelo y funcionará como una app nativa
- Pantalla completa, sin barra de Safari
- Funciona incluso sin internet

---

## 🔧 Si quieres una App Nativa Real

### Opción A: Capacitor (Intermedio)
```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. Inicializar
npx cap init "Solar Calculator" "com.solarcalculator.app"

# 3. Construir y sincronizar
npm run build
npx cap add ios
npx cap sync ios

# 4. Abrir en Xcode (necesitas Mac)
npx cap open ios
```

### Opción B: React Native (Avanzado)
```bash
# Crear nuevo proyecto
npx react-native init SolarCalculatorIPad

# Migrar componentes manualmente
# (Esto requiere más trabajo técnico)
```

---

## 💡 Mi Recomendación

**Usa PWA** porque:
- ✅ Es gratis
- ✅ Funciona perfectamente en iPad
- ✅ Se actualiza automáticamente
- ✅ No necesitas Mac ni cuenta de desarrollador
- ✅ La experiencia es casi idéntica a una app nativa

---

## 🚀 Para Empezar Ahora

1. **Ejecuta el script de PWA:**
   ```bash
   ./deploy-pwa.sh
   ```

2. **O publica manualmente:**
   ```bash
   npm run build
   npx vercel --prod
   ```

3. **Instala en tu iPad** siguiendo los pasos de arriba

¿Necesitas ayuda con algún paso? ¡Puedo asistirte en tiempo real!