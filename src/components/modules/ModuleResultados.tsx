'use client';

import { useState, useEffect } from 'react'; // Importar useState y useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calculator, Sun, Battery, Zap, Shield, Wrench, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { useCalculadoraSolar, TipoPanel } from '@/hooks/useCalculadoraSolar';

export default function ModuleResultados() {
  const {
    resultados,
    tiposPaneles,
    tipoPanelSeleccionado,
    actualizarTipoPanel,
    ejecutarCalculo,
    informacionBasica
  } = useCalculadoraSolar();

  const [metodoCalculoLocal, setMetodoCalculoLocal] = useState<'carga' | 'recibo'>('carga');

  // Nuevo estado para controlar si estamos en el cliente y cargados
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // Esto solo se ejecuta en el navegador, después de la hidratación inicial
    setIsClientLoaded(true);
  }, []);

  const ejecutarCalculoLocal = () => {
    ejecutarCalculo(metodoCalculoLocal);
  };

  // --- SOLUCIÓN AL ERROR DE HIDRATACIÓN ---
  // Si no estamos cargados en el cliente, renderizamos null inicialmente.
  if (!isClientLoaded) {
    return null;
  }
  // ----------------------------------------

  // Si estamos en el cliente, verificamos si los datos del hook están listos
  if (!tipoPanelSeleccionado || !informacionBasica) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
        <p className="text-gray-600">Cargando datos de la calculadora solar...</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Selector de Método de Cálculo */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Método de Cálculo
          </CardTitle>
          <CardDescription className="text-orange-50">
            Seleccione el método para dimensionar su sistema solar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={metodoCalculoLocal} onValueChange={(value) => setMetodoCalculoLocal(value as 'carga' | 'recibo')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="carga" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Por Análisis de Carga
              </TabsTrigger>
              <TabsTrigger value="recibo" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Por Recibo de Energía
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carga" className="mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Análisis por Carga Detallada</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Utiliza el consumo detallado de electrodomésticos para un cálculo preciso.
                      Considera patrones de uso específicos y factores de utilización.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recibo" className="mt-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Análisis por Histórico de Consumo</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Basado en sus facturas de energía. Considera variaciones estacionales
                      y patrones de consumo históricos para mayor precisión.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-center">
            <Button onClick={ejecutarCalculoLocal} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-8">
              <Calculator className="w-4 h-4 mr-2" />
              Ejecutar Cálculo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Tipo de Panel */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Selección de Panel Solar
          </CardTitle>
          <CardDescription className="text-purple-50">
            Elija el tipo de panel para optimizar su instalación
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Tipo de Panel Solar
              </Label>
              {tiposPaneles && tiposPaneles.length > 0 ? (
                <Select
                  value={tipoPanelSeleccionado.id}
                  onValueChange={(value) => {
                    const panel = tiposPaneles.find(p => p.id === value);
                    if (panel) actualizarTipoPanel(panel);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un panel" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPaneles.map((panel) => (
                      <SelectItem key={panel.id} value={panel.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{panel.nombre}</span>
                          <span className="text-xs text-slate-500">
                            {panel.potencia}Wp • {panel.eficiencia}% • ${(panel.precio || 0).toLocaleString('es-CO')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">Cargando opciones de paneles...</p>
              )}
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Panel Seleccionado</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Potencia:</span>
                  <span className="font-medium">{tipoPanelSeleccionado.potencia} Wp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Eficiencia:</span>
                  <span className="font-medium">{tipoPanelSeleccionado.eficiencia}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Dimensiones:</span>
                  <span className="font-medium">{tipoPanelSeleccionado.dimensiones.ancho}×{tipoPanelSeleccionado.dimensiones.alto}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Tecnología:</span>
                  <span className="font-medium">{tipoPanelSeleccionado.tecnologia}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados del Cálculo */}
      {resultados ? (
        <>
          {/* Resumen Principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Consumo Diario</p>
                    <p className="text-2xl font-bold">{(resultados.consumoDiario || 0).toFixed(1)} kWh</p>
                    <p className="text-blue-100 text-xs">Por día</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
             <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Paneles Requeridos</p>
                    <p className="text-2xl font-bold">{resultados.numPaneles}</p>
                    <p className="text-green-100 text-xs">Unidades de {tipoPanelSeleccionado.potencia} Wp</p>
                  </div>
                  <Sun className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Producción Total</p>
                    <p className="text-2xl font-bold">{((resultados.numPaneles || 0) * (tipoPanelSeleccionado.potencia || 0) * 0.001 * (informacionBasica.hsp || 0)).toFixed(1)} kWh</p>
                    <p className="text-indigo-100 text-xs">Estimado diario</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-indigo-200" />
                </div>
              </CardContent>
            </Card>
             <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Inversión Estimada</p>
                    <p className="text-xl font-bold">${(resultados.costoTotal || 0).toLocaleString('es-CO')}</p>
                    <p className="text-amber-100 text-xs">Incluye paneles e inversor</p>
                  </div>
                  <Wrench className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalles Técnicos Adicionales */}
        </>
      ) : (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-500">Ejecute el cálculo para ver los resultados.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
