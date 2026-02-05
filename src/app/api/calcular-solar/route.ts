import { NextRequest, NextResponse } from 'next/server';

interface DatosCalculo {
  metodo: 'carga' | 'recibo';
  consumoDiario?: number;
  consumoMensual?: number;
  hsp: number;
  tipoInversor: string;
  eficienciaPanel?: number;
  factorPerdidas?: number;
}

export async function POST(request: NextRequest) {
  try {
    const datos: DatosCalculo = await request.json();

    // Validar datos de entrada
    if (!datos.metodo || !datos.hsp || !datos.tipoInversor) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para el cálculo' },
        { status: 400 }
      );
    }

    // Valores por defecto
    const eficienciaPanel = datos.eficienciaPanel || 0.17; // 17% eficiencia típica
    const factorPerdidas = datos.factorPerdidas || 0.85; // 15% de pérdidas del sistema
    const potenciaPanel = 550; // Wp estándar

    // Determinar consumo
    let consumoDiario: number;
    if (datos.metodo === 'carga' && datos.consumoDiario) {
      consumoDiario = datos.consumoDiario;
    } else if (datos.metodo === 'recibo' && datos.consumoMensual) {
      consumoDiario = datos.consumoMensual / 30;
    } else {
      return NextResponse.json(
        { error: 'Se requiere consumo diario o mensual según el método' },
        { status: 400 }
      );
    }

    // Cálculos del sistema solar
    const potenciaRequerida = (consumoDiario / datos.hsp) / factorPerdidas; // kWp
    const numeroPaneles = Math.ceil(potenciaRequerida * 1000 / potenciaPanel);
    const potenciaRealInstalada = numeroPaneles * potenciaPanel; // Wp

    // Cálculo del inversor (30% de margen de seguridad)
    const potenciaInversor = Math.ceil(consumoDiario * 1.3 * 1000 / 100) * 100; // VA

    // Cálculo de baterías (solo para sistemas híbridos y off-grid)
    let capacidadBateria = 0;
    let autonomiaDias = 0;
    let profundidadDescarga = 0.8; // 80% para baterías de litio

    if (datos.tipoInversor === 'hibrido' || datos.tipoInversor === 'off-grid') {
      autonomiaDias = datos.tipoInversor === 'off-grid' ? 3 : 2; // Más autonomía para off-grid
      const energiaAlmacenar = consumoDiario * autonomiaDias;
      capacidadBateria = Math.ceil(energiaAlmacenar / (48 * profundidadDescarga)); // 48V sistema
    }

    // Cálculo de cableado (aproximado)
    const distanciaInversor = 15; // metros promedio
    const corrienteMaxima = potenciaRealInstalada / (48 * Math.sqrt(3)); // Sistema trifásico 48V
    const seccionCableDC = Math.ceil(corrienteMaxima * 1.25 / 3); // mm² con 25% margen

    // Generación anual estimada
    const generacionAnual = potenciaRealInstalada * datos.hsp * 365 * factorPerdidas / 1000; // kWh/año

    // Ahorro anual (asumiendo precio promedio de $500/kWh)
    const precioKwh = 500;
    const ahorroAnual = generacionAnual * precioKwh;

    // ROI simple
    const costoInstalacionEstimado = potenciaRealInstalada * 2500; // $2,500 por kWp instalado
    const roiAnios = costoInstalacionEstimado / ahorroAnual;

    const resultado = {
      consumo: {
        diario: consumoDiario,
        mensual: consumoDiario * 30,
        anual: consumoDiario * 365
      },
      sistemaFotovoltaico: {
        potenciaRequerida: Math.round(potenciaRequerida * 1000), // Wp
        numeroPaneles,
        potenciaPanel,
        potenciaRealInstalada,
        areaRequerida: numeroPaneles * 2.2, // m² (2.2m² por panel 550Wp)
        eficienciaPanel,
        factorPerdidas
      },
      inversor: {
        tipo: datos.tipoInversor,
        potenciaRequerida: potenciaInversor, // VA
        eficiencia: 0.95,
        margenSeguridad: 30
      },
      almacenamiento: {
        requerido: datos.tipoInversor === 'hibrido' || datos.tipoInversor === 'off-grid',
        capacidad: capacidadBateria, // Ah
        tension: 48, // V
        autonomia: autonomiaDias,
        profundidadDescarga
      },
      cableado: {
        seccionCableDC: Math.max(seccionCableDC, 6), // Mínimo 6mm²
        seccionCableAC: Math.max(Math.ceil(potenciaInversor / 1000 * 2.5), 2.5), // mm²
        distanciaInversor
      },
      protecciones: {
        breakerDC: Math.ceil(corrienteMaxima * 1.25),
        breakerAC: Math.ceil(potenciaInversor / 220),
        dps: 'Tipo 2',
        puestaTierra: true
      },
      rendimiento: {
        generacionAnual: Math.round(generacionAnual),
        factorCapacidad: (generacionAnual / (potenciaRealInstalada / 1000 * 8760)) * 100,
        ahorroAnual: Math.round(ahorroAnual),
        co2Evitado: Math.round(generacionAnual * 0.4), // kg CO2/kWh
        roiAnios: Math.round(roiAnios * 10) / 10
      },
      recomendaciones: generarRecomendaciones(datos.tipoInversor, numeroPaneles, consumoDiario)
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en cálculo solar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function generarRecomendaciones(tipoInversor: string, numeroPaneles: number, consumoDiario: number): string[] {
  const recomendaciones = [
    `Instalar ${numeroPaneles} paneles de 550Wp para óptimo rendimiento`,
    'Orientación ideal: Sur con inclinación de 15-20°',
    'Mantenimiento preventivo cada 6 meses',
    'Monitoreo continuo del rendimiento del sistema'
  ];

  if (tipoInversor === 'hibrido') {
    recomendaciones.push(
      'Configurar sistema de gestión de carga para maximizar uso solar',
      'Considerar programación de cargas durante horas de alta radiación'
    );
  } else if (tipoInversor === 'off-grid') {
    recomendaciones.push(
      'Implementar sistema de gestión energética con priorización de cargas',
      'Considerar generador de respaldo para períodos prolongados sin sol'
    );
  }

  if (consumoDiario > 20) {
    recomendaciones.push(
      'Evaluar posibilidad de dividir instalación en dos arreglos independientes',
      'Considerar sistema de monitoreo por circuitos para optimizar consumo'
    );
  }

  return recomendaciones;
}