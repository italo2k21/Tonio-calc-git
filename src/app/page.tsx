// src/app/page.tsx (Tu archivo principal)

'use client'; // Asumo que tu página principal es un Client Component

import { useState, useEffect } from 'react'; // Necesitas estas importaciones aquí
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ModuleInformacionBasica from '@/components/modules/ModuleInformacionBasica';
import ModuleElectrodomesticos from '@/components/modules/ModuleElectrodomesticos';
import ModuleReciboEnergia from '@/components/modules/ModuleReciboEnergia';
import ModuleResultados from '@/components/modules/ModuleResultados';
import { useCalculadoraSolar } from '@/hooks/useCalculadoraSolar';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { informacionBasica, tipoPanelSeleccionado } = useCalculadoraSolar();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('informacion'); // Controla la pestaña activa localmente

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  if (!isClientLoaded || !informacionBasica || !tipoPanelSeleccionado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg">Cargando aplicación solar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Calculadora Solar Interactiva
        </h1>
        <Card className="shadow-2xl border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-b-none p-0 bg-gray-100">
              <TabsTrigger value="informacion">1. Info Básica</TabsTrigger>
              <TabsTrigger value="cargas">2. Cargas/Recibo</TabsTrigger>
              <TabsTrigger value="presupuesto">3. Presupuesto</TabsTrigger>
              <TabsTrigger value="resultados">4. Resultados</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="informacion" className="space-y-6">
                <ModuleInformacionBasica />
              </TabsContent>

              <TabsContent value="cargas" className="space-y-6">
                <ModuleElectrodomesticos />
                <ModuleReciboEnergia />
              </TabsContent>

              <TabsContent value="presupuesto" className="space-y-6">
                {/* Asumo que tienes un módulo para el presupuesto o un placeholder */}
                <p>Módulo de Presupuesto aquí.</p>
              </TabsContent>

              <TabsContent value="resultados" className="space-y-6">
                <ModuleResultados />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
