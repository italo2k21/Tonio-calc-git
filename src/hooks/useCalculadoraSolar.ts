'use client';

import { useState, useEffect } from 'react';

// Tipos de paneles solares disponibles
export interface TipoPanel {
  id: string;
  nombre: string;
  potencia: number; // Wp
  eficiencia: number; // %
  dimensiones: { ancho: number; alto: number }; // metros
  precio: number; // COP
  tecnologia: string;
}

// Datos básicos del proyecto
export interface InformacionBasica {
  ubicacion: string;
  hsp: number;
  tipoInstalacion: 'residencial' | 'comercial' | 'industrial';
  tipoInversor: 'on-grid' | 'off-grid' | 'hibrido';
  consumoMensual: number;
  presupuesto: number;
  tipoTejado: string;
}

// Datos de consumo por electrodomésticos
export interface Electrodomestico {
  id: string;
  nombre: string;
  cantidad: number;
  potencia: number; // W
  horasUso: number; // horas/día
  diasUso: number; // días/semana
}

// Datos del recibo de luz
export interface DatosRecibo {
  empresa: string;
  consumoKwh: number;
  costoTotal: number;
  promedioDiario: number;
}

// Resultados del cálculo (Ajustado para usar 'costoTotal' en lugar de 'costoEstimado' para evitar el error anterior)
export interface ResultadoCalculo {
  metodo: 'carga' | 'recibo';
  consumoDiario: number;
  consumoMensual: number;
  potenciaRequerida: number;
  numeroPaneles: number;
  tipoPanelSeleccionado: TipoPanel;
  potenciaInversor: number;
  capacidadBateria: number;
  areaRequerida: number;
  // Propiedad renombrada para coincidir con el componente principal:
  costoTotal: number;
  tipoInversor: string;
  recomendaciones: string[];
  margenSeguridad: number;
  numPaneles?: number; // Añadido opcionalmente si es necesario para el otro componente
}

const tiposPaneles: TipoPanel[] = [
  {
    id: 'monocristalino-400',
    nombre: 'Panel Monocristalino 400Wp',
    potencia: 400,
    eficiencia: 22.5,
    dimensiones: { ancho: 1.75, alto: 1.04 },
    precio: 1200000,
    tecnologia: 'Monocristalino'
  },
  {
    id: 'monocristalino-450',
    nombre: 'Panel Monocristalino 450Wp',
    potencia: 450,
    eficiencia: 23.5,
    dimensiones: { ancho: 1.89, alto: 1.04 },
    precio: 1350000,
    tecnologia: 'Monocristalino'
  },
  {
    id: 'monocristalino-500',
    nombre: 'Panel Monocristalino 500Wp',
    potencia: 500,
    eficiencia: 24.0,
    dimensiones: { ancho: 2.0, alto: 1.1 },
    precio: 1500000,
    tecnologia: 'Monocristalino'
  },
  {
    id: 'monocristalino-550',
    nombre: 'Panel Monocristalino 550Wp',
    potencia: 550,
    eficiencia: 24.5,
    dimensiones: { ancho: 2.1, alto: 1.13 },
    precio: 1650000,
    tecnologia: 'Monocristalino'
  },
  {
    id: 'policristalino-350',
    nombre: 'Panel Policristalino 350Wp',
    potencia: 350,
    eficiencia: 18.5,
    dimensiones: { ancho: 1.95, alto: 0.99 },
    precio: 980000,
    tecnologia: 'Policristalino'
  },
  {
    id: 'flexible-100',
    nombre: 'Panel Flexible 100Wp',
    potencia: 100,
    eficiencia: 16.0,
    dimensiones: { ancho: 1.1, alto: 0.54 },
    precio: 450000,
    tecnologia: 'Flexible'
  }
];

export function useCalculadoraSolar() {
  const [informacionBasica, setInformacionBasica] = useState<InformacionBasica>({
    ubicacion: '',
    hsp: 4.5,
    tipoInstalacion: 'residencial',
    tipoInversor: 'on-grid',
    consumoMensual: 300,
    presupuesto: 10000000,
    tipoTejado: ''
  });

  const [electrodomesticos, setElectrodomesticos] = useState<Electrodomestico[]>([
    { id: '1', nombre: 'Nevera', cantidad: 1, potencia: 150, horasUso: 24, diasUso: 7 },
    { id: '2', nombre: 'Televisor', cantidad: 2, potencia: 100, horasUso: 5, diasUso: 7 },
    { id: '3', nombre: 'Bombillos LED', cantidad: 8, potencia: 10, horasUso: 6, diasUso: 7 }
  ]);

  const [datosRecibo, setDatosRecibo] = useState<DatosRecibo>({
    empresa: '',
    consumoKwh: 0,
    costoTotal: 0,
    promedioDiario: 0
  });

  const [tipoPanelSeleccionado, setTipoPanelSeleccionado] = useState<TipoPanel>(tiposPaneles[2]); // 500Wp por defecto
  const [resultados, setResultados] = useState<ResultadoCalculo | null>(null);

  // Función para calcular consumo por electrodomésticos
  const calcularConsumoPorCarga = (): number => {
    return electrodomesticos.reduce((total, electrodomestico) => {
      const consumoDiario = (electrodomestico.potencia * electrodomestico.horasUso * electrodomestico.diasUso) / 7;
      return total + consumoDiario;
    }, 0) / 1000; // Convertir a kWh
  };

  // Función para calcular consumo por recibo
  const calcularConsumoPorRecibo = (): number => {
    return datosRecibo.consumoKwh / 30; // Promedio diario
  };

  // Función principal de cálculo que NO ACTUALIZA EL ESTADO, solo retorna el resultado
  const generarCalculoSolar = (metodo: 'carga' | 'recibo'): ResultadoCalculo => {
    const consumoDiario = metodo === 'carga' ? calcularConsumoPorCarga() : calcularConsumoPorRecibo();
    const consumoMensual = consumoDiario * 30;

    // Cálculo de potencia requerida con margen de seguridad
    const margenSeguridad = 1.25; // 25% de margen
    const potenciaRequeridaWp = Math.ceil((consumoDiario / informacionBasica.hsp) * 1000 * margenSeguridad);

    // Cálculo del número de paneles
    const numeroPaneles = Math.ceil(potenciaRequeridaWp / tipoPanelSeleccionado.potencia);

    // Cálculo del área requerida
    const areaPanel = tipoPanelSeleccionado.dimensiones.ancho * tipoPanelSeleccionado.dimensiones.alto;
    const areaRequerida = numeroPaneles * areaPanel;

    // Cálculo de potencia del inversor (con margen del 30%)
    const potenciaInversorVA = Math.ceil((consumoDiario * 1000 * 1.3) / 100) * 100;

    // Cálculo de capacidad de batería (solo para off-grid o híbrido)
    let capacidadBateria = 0;
    if (informacionBasica.tipoInversor === 'off-grid' || informacionBasica.tipoInversor === 'hibrido') {
      const autonomiaDias = 2; // 2 días de autonomía
      const profundidadDescarga = 0.8; // 80% máxima descarga
      const voltajeSistema = 48; // 48V
      capacidadBateria = Math.ceil((consumoDiario * autonomiaDias * 1000) / (voltajeSistema * profundidadDescarga));
    }

    // Cálculo del costo estimado
    const costoPaneles = numeroPaneles * tipoPanelSeleccionado.precio;
    const costoInversor = potenciaInversorVA * 3000; // ~$3000 por VA (esto es un estimado muy alto, revisar)
    const costoEstructura = numeroPaneles * 300000; // ~$300k por panel
    const costoInstalacion = (costoPaneles + costoInversor + costoEstructura) * 0.15; // 15% de instalación
    const costoBaterias = capacidadBateria * 15000; // ~$15k por Ah
    const costoTotal = costoPaneles + costoInversor + costoEstructura + costoInstalacion + costoBaterias;

    // Generar recomendaciones
    const recomendaciones = [
      `Se recomienda instalar ${numeroPaneles} paneles ${tipoPanelSeleccionado.tecnologia.toLowerCase()} de ${tipoPanelSeleccionado.potencia}Wp`,
      `El área requerida es de ${areaRequerida.toFixed(1)} m² para la instalación`,
      `El inversor debe tener capacidad de ${potenciaInversorVA} VA con 30% de margen de seguridad`,
      `Considerar ángulo de inclinación de ${informacionBasica.ubicacion.includes('Bogotá') ? '15-20°' : '10-15°'} para máxima eficiencia`,
      `Se requiere mantenimiento cada 6 meses para garantizar rendimiento óptimo`
    ];

    if (informacionBasica.tipoInversor === 'off-grid' || informacionBasica.tipoInversor === 'hibrido') {
      recomendaciones.push(`Se instalará sistema de baterías con ${capacidadBateria} Ah de capacidad para 2 días de autonomía`);
    }

    if (costoTotal > informacionBasica.presupuesto) {
      recomendaciones.push(`⚠️ El costo estimado excede el presupuesto. Considere reducir el número de paneles o aumentar el presupuesto`);
    }

    return {
      metodo,
      consumoDiario,
      consumoMensual,
      potenciaRequerida: potenciaRequeridaWp,
      numeroPaneles,
      tipoPanelSeleccionado,
      potenciaInversor: potenciaInversorVA,
      capacidadBateria,
      areaRequerida,
      costoTotal, // Usamos costoTotal para que coincida con el componente de UI
      tipoInversor: informacionBasica.tipoInversor,
      recomendaciones,
      margenSeguridad: margenSeguridad * 100 - 100,
      numPaneles: numeroPaneles, // Añadido para compatibilidad
    };
  };

  // --- FUNCIÓN CLAVE PARA EL BOTÓN ---
  // Esta función llama al cálculo y actualiza el estado 'resultados'
  const ejecutarCalculo = (metodo: 'carga' | 'recibo') => {
    console.log("EJECUTANDO CALCULO:", metodo);
    const nuevosResultados = generarCalculoSolar(metodo);
    setResultados(nuevosResultados);
  };
  // ------------------------------------

  // Funciones para actualizar datos (completadas)
  const actualizarInformacionBasica = (datos: Partial<InformacionBasica>) => {
    setInformacionBasica(prev => ({ ...prev, ...datos }));
  };

  const actualizarElectrodomesticos = (nuevosElectrodomesticos: Electrodomestico[]) => {
    setElectrodomesticos(nuevosElectrodomesticos);
  };

  const actualizarDatosRecibo = (datos: Partial<DatosRecibo>) => {
    setDatosRecibo(prev => ({ ...prev, ...datos }));
  };

  const actualizarTipoPanel = (panel: TipoPanel) => {
    setTipoPanelSeleccionado(panel);
  };

  // EL RETURN FINAL DEL HOOK (COMPLETADO)
  return {
    informacionBasica,
    setInformacionBasica,
    electrodomesticos,
    actualizarElectrodomesticos,
    datosRecibo,
    actualizarDatosRecibo,
    tiposPaneles, // Lista estática de paneles
    tipoPanelSeleccionado,
    actualizarTipoPanel,
    resultados,
    ejecutarCalculo, // Función expuesta para el botón
    // Exporta aquí cualquier otra cosa que necesites
  };
}
