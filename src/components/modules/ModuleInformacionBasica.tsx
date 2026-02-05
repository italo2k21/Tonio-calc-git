'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculadoraSolar } from '@/hooks/useCalculadoraSolar';


export default function ModuleInformacionBasica() {
  const { informacionBasica, actualizarInformacionBasica } = useCalculadoraSolar();

  // Nuevo estado para controlar si estamos en el cliente y cargados
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // Esto solo se ejecuta en el navegador, después de la hidratación inicial
    setIsClientLoaded(true);
  }, []);

  // Si no estamos cargados en el cliente, renderizamos null o un placeholder ligero que
  // coincida con lo que el servidor renderizó (idealmente nada extra o un div vacío)
  if (!isClientLoaded) {
    // El servidor renderiza un div vacío (o nada si lo manejas en el layout principal)
    // Para evitar hydration errors, evitamos renderizar el loader complejo aquí inicialmente.
    return null;
  }

  // Ahora, como estamos seguros de que es el cliente, podemos usar la lógica completa.
  // Mantenemos la verificación de datos por si el hook es asíncrono.
  if (!actualizarInformacionBasica || !informacionBasica) {
    return (
      <Card className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <p className="text-gray-600">Cargando módulo de información básica...</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica del Proyecto</CardTitle>
        <CardDescription>Ingrese los datos principales de su instalación.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo Ubicación */}
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación (Ciudad/País)</Label>
          <Input
            id="ubicacion"
            value={informacionBasica.ubicacion}
            onChange={(e) => actualizarInformacionBasica({ ubicacion: e.target.value })}
            placeholder="Ej: Bogotá, Colombia"
          />
        </div>

        {/* Campo HSP (Horas de Sol Pico) */}
        <div className="space-y-2">
          <Label htmlFor="hsp">HSP Promedio (Horas de Sol Pico)</Label>
          <Input
            id="hsp"
            type="number"
            value={informacionBasica.hsp}
            onChange={(e) => actualizarInformacionBasica({ hsp: parseFloat(e.target.value) || 0 })}
            placeholder="Ej: 4.5"
          />
        </div>

        {/* Selector Tipo de Instalación */}
        <div className="space-y-2">
          <Label htmlFor="tipoInstalacion">Tipo de Instalación</Label>
          <Select
            value={informacionBasica.tipoInstalacion}
            onValueChange={(value) => actualizarInformacionBasica({ tipoInstalacion: value as 'residencial' | 'comercial' | 'industrial' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector Tipo de Inversor */}
        <div className="space-y-2">
          <Label htmlFor="tipoInversor">Tipo de Inversor</Label>
          <Select
            value={informacionBasica.tipoInversor}
            onValueChange={(value) => actualizarInformacionBasica({ tipoInversor: value as 'on-grid' | 'off-grid' | 'hibrido' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione inversor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-grid">On-Grid (Interconectado)</SelectItem>
              <SelectItem value="off-grid">Off-Grid (Aislado)</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campo Consumo Mensual */}
        <div className="space-y-2">
          <Label htmlFor="consumoMensual">Consumo Mensual (kWh)</Label>
          <Input
            id="consumoMensual"
            type="number"
            value={informacionBasica.consumoMensual}
            onChange={(e) => actualizarInformacionBasica({ consumoMensual: parseFloat(e.target.value) || 0 })}
            placeholder="Ej: 300"
          />
        </div>

        {/* Campo Presupuesto */}
        <div className="space-y-2">
          <Label htmlFor="presupuesto">Presupuesto Estimado (COP)</Label>
          <Input
            id="presupuesto"
            type="number"
            value={informacionBasica.presupuesto}
            onChange={(e) => actualizarInformacionBasica({ presupuesto: parseFloat(e.target.value) || 0 })}
            placeholder="Ej: 10,000,000"
          />
        </div>

         {/* Campo Tipo de Tejado */}
         <div className="space-y-2">
          <Label htmlFor="tipoTejado">Tipo de Tejado</Label>
          <Input
            id="tipoTejado"
            value={informacionBasica.tipoTejado}
            onChange={(e) => actualizarInformacionBasica({ tipoTejado: e.target.value })}
            placeholder="Ej: Inclinado, Plano, Zinc"
          />
        </div>

      </CardContent>
    </Card>
  );
}
