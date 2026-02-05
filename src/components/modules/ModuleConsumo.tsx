'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Zap, Lightbulb, Tv, Refrigerator, WashingMachine, Laptop, Microwave, Coffee, BarChart3, Smartphone, Wifi, Camera, Fan, Wind, Speaker } from 'lucide-react';
import { useCalculadoraSolar } from '@/hooks/useCalculadoraSolar';

interface Electrodomestico {
  id: string;
  nombre: string;
  icono: React.ReactNode;
  cantidad: number;
  potencia: number;
  horasDia: number;
  diasUso: number;
}

const electrodomesticosPredefinidos = [
  // Electrodomésticos básicos existentes
  { nombre: 'Nevera', icono: <Refrigerator className="w-5 h-5" />, potencia: 150 },
  { nombre: 'Televisor', icono: <Tv className="w-5 h-5" />, potencia: 100 },
  { nombre: 'Bombilla LED', icono: <Lightbulb className="w-5 h-5" />, potencia: 10 },
  { nombre: 'Lavadora', icono: <WashingMachine className="w-5 h-5" />, potencia: 500 },
  { nombre: 'Computador', icono: <Laptop className="w-5 h-5" />, potencia: 65 },
  { nombre: 'Microondas', icono: <Microwave className="w-5 h-5" />, potencia: 800 },
  { nombre: 'Cafetera', icono: <Coffee className="w-5 h-5" />, potencia: 1000 },
  
  // Nuevos electrodomésticos de uso cotidiano
  { nombre: 'Cargador Celular', icono: <Smartphone className="w-5 h-5" />, potencia: 20 },
  { nombre: 'Router WiFi', icono: <Wifi className="w-5 h-5" />, potencia: 15 },
  { nombre: 'Cámara Seguridad', icono: <Camera className="w-5 h-5" />, potencia: 25 },
  { nombre: 'Ventilador', icono: <Fan className="w-5 h-5" />, potencia: 75 },
  { nombre: 'Aire Acondicionado', icono: <Wind className="w-5 h-5" />, potencia: 1200 },
  { nombre: 'Equipo Sonido', icono: <Speaker className="w-5 h-5" />, potencia: 100 },
  { nombre: 'Licuadora', icono: <Zap className="w-5 h-5" />, potencia: 400 },
  { nombre: 'Plancha Ropa', icono: <Zap className="w-5 h-5" />, potencia: 1000 },
  
  // Opción personalizada
  { nombre: 'Otro', icono: <Zap className="w-5 h-5" />, potencia: 0 }
];

export default function ModuleConsumo() {
  const { electrodomesticos, actualizarElectrodomesticos, calcularConsumoPorCarga } = useCalculadoraSolar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevoElectrodomestico, setNuevoElectrodomestico] = useState({
    nombre: '',
    icono: <Zap className="w-5 h-5" />,
    cantidad: 1,
    potencia: 0,
    horasDia: 1,
    diasUso: 7
  });

  const agregarElectrodomestico = () => {
    if (!nuevoElectrodomestico.nombre || nuevoElectrodomestico.potencia <= 0) return;

    const electrodomestico = {
      id: Date.now().toString(),
      nombre: nuevoElectrodomestico.nombre,
      cantidad: nuevoElectrodomestico.cantidad,
      potencia: nuevoElectrodomestico.potencia,
      horasUso: nuevoElectrodomestico.horasDia,
      diasUso: nuevoElectrodomestico.diasUso
    };

    actualizarElectrodomesticos([...electrodomesticos, electrodomestico]);
    setNuevoElectrodomestico({
      nombre: '',
      icono: <Zap className="w-5 h-5" />,
      cantidad: 1,
      potencia: 0,
      horasDia: 1,
      diasUso: 7
    });
    setDialogOpen(false);
  };

  const eliminarElectrodomestico = (id: string) => {
    actualizarElectrodomesticos(electrodomesticos.filter(el => el.id !== id));
  };

  const seleccionarPredefinido = (predefinido: any) => {
    setNuevoElectrodomestico(prev => ({
      ...prev,
      nombre: predefinido.nombre,
      icono: predefinido.icono,
      potencia: predefinido.potencia
    }));
  };

  const consumoTotalDiario = calcularConsumoPorCarga();
  const consumoTotalMensual = consumoTotalDiario * 30;

  // Función para calcular consumo individual
  const calcularConsumoIndividual = (electrodomestico: any) => {
    return (electrodomestico.potencia * electrodomestico.horasUso * electrodomestico.diasUso) / (7 * 1000);
  };

  // Ordenar electrodomésticos por consumo para la gráfica
  const electrodomesticosOrdenados = [...electrodomesticos].sort((a, b) => calcularConsumoIndividual(b) - calcularConsumoIndividual(a));
  const maxConsumo = Math.max(...electrodomesticos.map(el => calcularConsumoIndividual(el)), 1);

  return (
    <div className="space-y-6">
      {/* Resumen de Consumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Consumo Diario Total</p>
                <p className="text-2xl font-bold">{consumoTotalDiario.toFixed(2)} kWh</p>
              </div>
              <Zap className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Consumo Mensual Total</p>
                <p className="text-2xl font-bold">{consumoTotalMensual.toFixed(0)} kWh</p>
              </div>
              <Lightbulb className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Equipos</p>
                <p className="text-2xl font-bold">{electrodomesticos.length}</p>
              </div>
              <Tv className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agregar Electrodoméstico */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Consumo Eléctrico Detallado
              </CardTitle>
              <CardDescription className="text-orange-50">
                Agregue los electrodomésticos para calcular el consumo
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Electrodoméstico
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Electrodoméstico</DialogTitle>
                  <DialogDescription>
                    Seleccione un equipo predefinido o configure uno personalizado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Selección Rápida */}
                  <div>
                    <Label className="text-sm font-medium">Electrodomésticos Comunes</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto">
                      {electrodomesticosPredefinidos.map((predefinido, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => seleccionarPredefinido(predefinido)}
                          className="flex flex-col items-center gap-1 h-auto py-3 px-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                        >
                          {predefinido.icono}
                          <span className="text-xs text-center leading-tight">{predefinido.nombre}</span>
                          <span className="text-xs text-slate-500">{predefinido.potencia}W</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Formulario */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="nombre">Nombre del Electrodoméstico</Label>
                      <Input
                        id="nombre"
                        value={nuevoElectrodomestico.nombre}
                        onChange={(e) => setNuevoElectrodomestico(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Ej: Nevera, Televisor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="1"
                        value={nuevoElectrodomestico.cantidad}
                        onChange={(e) => setNuevoElectrodomestico(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="potencia">Potencia (W)</Label>
                      <Input
                        id="potencia"
                        type="number"
                        min="1"
                        value={nuevoElectrodomestico.potencia}
                        onChange={(e) => setNuevoElectrodomestico(prev => ({ ...prev, potencia: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="horas">Horas de uso por día</Label>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {nuevoElectrodomestico.horasDia.toFixed(1)} horas
                        </Badge>
                      </div>
                      <Slider
                        value={[nuevoElectrodomestico.horasDia]}
                        onValueChange={(value) => setNuevoElectrodomestico(prev => ({ ...prev, horasDia: value[0] }))}
                        max={24}
                        min={0.1}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0.1h</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>18h</span>
                        <span>24h</span>
                      </div>
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-700">Uso diario:</p>
                            <p className="text-lg font-bold text-blue-700">
                              {nuevoElectrodomestico.horasDia.toFixed(1)} horas
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Consumo estimado:</p>
                            <p className="text-sm font-semibold text-blue-600">
                              {((nuevoElectrodomestico.potencia * nuevoElectrodomestico.horasDia) / 1000).toFixed(2)} kWh/día
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          ⏰ Uso típico: 0.5-8h para electrodomésticos, 24h para nevera/router
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={agregarElectrodomestico}>
                      Agregar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {electrodomesticos.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Zap className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No hay electrodomésticos agregados</p>
              <p className="text-sm">Haga clic en "Agregar Electrodoméstico" para comenzar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Electrodoméstico</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Potencia (W)</TableHead>
                  <TableHead className="text-center">Horas/día</TableHead>
                  <TableHead className="text-center">Consumo (kWh/día)</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {electrodomesticos.map((electrodomestico) => (
                  <TableRow key={electrodomestico.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {electrodomestico.icono}
                        <span className="font-medium">{electrodomestico.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{electrodomestico.cantidad}</TableCell>
                    <TableCell className="text-center">{electrodomestico.potencia}</TableCell>
                    <TableCell className="text-center">{electrodomestico.horasDia}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {calcularConsumoIndividual(electrodomestico).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarElectrodomestico(electrodomestico.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Gráfica de Consumo */}
      {electrodomesticos.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis de Consumo por Equipo
            </CardTitle>
            <CardDescription className="text-orange-50">
              Distribución del consumo diario por electrodoméstico
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {electrodomesticosOrdenados.map((electrodomestico, index) => {
                const porcentaje = (calcularConsumoIndividual(electrodomestico) / maxConsumo) * 100;
                return (
                  <div key={electrodomestico.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {electrodomestico.icono}
                        <span className="font-medium">{electrodomestico.nombre}</span>
                        <Badge variant="outline" className="text-xs">
                          {electrodomestico.cantidad} unidades
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{calcularConsumoIndividual(electrodomestico).toFixed(2)} kWh/día</span>
                        <span className="text-sm text-slate-500 ml-2">
                          ({((calcularConsumoIndividual(electrodomestico) / consumoTotalDiario) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      >
                        {porcentaje > 10 && (
                          <span className="text-xs text-white font-medium">
                            {porcentaje.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}