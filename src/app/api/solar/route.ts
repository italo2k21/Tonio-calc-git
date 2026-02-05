import { NextRequest, NextResponse } from 'next/server';

interface DatosSolar {
  ubicacion: string;
  hsp: number;
  tipoInstalacion: string;
  tipoInversor: string;
  consumoMensual: number;
  presupuesto: number;
  tipoTejado: string;
  electrodomesticos?: Array<{
    nombre: string;
    cantidad: number;
    potencia: number;
    horasDia: number;
    consumoDiario: number;
  }>;
}

interface ResultadoSolar {
  paneles: {
    cantidad: number;
    potenciaUnitaria: number;
    potenciaTotal: number;
    areaRequerida: number;
  };
  inversor: {
    tipo: string;
    potencia: number;
    eficiencia: number;
  };
  baterias?: {
    capacidad: number;
    cantidad: number;
    autonomia: number;
  };
  sistemaProteccion: {
    tableroAc: boolean;
    tableroDc: boolean;
    protecciones: string[];
    cableado: boolean;
    tierra: boolean;
  };
  condicionesTejado: string[];
  analisisEconomico: {
    costoEstimado: number;
    ahorroAnual: number;
    periodoRetorno: number;
    roi: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const datos: DatosSolar = await request.json();

    // Validar datos mínimos
    if (!datos.hsp || !datos.consumoMensual || !datos.tipoInversor) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios para el cálculo' },
        { status: 400 }
      );
    }

    // Calcular consumo diario
    const consumoDiario = datos.consumoMensual / 30;

    // Calcular potencia requerida del sistema (considerando eficiencias)
    const eficienciaSistema = 0.85; // 85% eficiencia general
    const potenciaRequerida = consumoDiario / (datos.hsp * eficienciaSistema);

    // Calcular número de paneles (paneles estándar de 550W)
    const potenciaPanel = 550; // Watts
    const cantidadPaneles = Math.ceil(potenciaRequerida / potenciaPanel);
    const potenciaTotalPaneles = cantidadPaneles * potenciaPanel;
    const areaPorPanel = 2.2; // m² por panel estándar
    const areaRequerida = cantidadPaneles * areaPorPanel;

    // Calcular inversor (1.25x la potencia máxima requerida)
    const potenciaInversor = Math.ceil(potenciaRequerida * 1.25 / 1000) * 1000; // Redondear al siguiente kW

    // Calcular baterías solo para sistemas off-grid o híbridos
    let baterias = undefined;
    if (datos.tipoInversor === 'off-grid' || datos.tipoInversor === 'hibrido') {
      const diasAutonomia = datos.tipoInversor === 'off-grid' ? 3 : 1;
      const profundidadDescarga = 0.8; // 80% máxima descarga
      const capacidadBateria = (consumoDiario * diasAutonomia) / profundidadDescarga;
      const capacidadBateriaWh = capacidadBateria * 1000;
      
      // Baterías estándar de 200Ah a 48V = 9.6kWh
      const capacidadBateriaEstandar = 9600; // Wh
      const cantidadBaterias = Math.ceil(capacidadBateriaWh / capacidadBateriaEstandar);

      baterias = {
        capacidad: Math.ceil(capacidadBateriaWh / 1000), // kWh
        cantidad: cantidadBaterias,
        autonomia: diasAutonomia
      };
    }

    // Sistema de protección
    const sistemaProteccion = {
      tableroAc: true,
      tableroDc: true,
      protecciones: [
        'Interruptor termomagnético AC',
        'Interruptor diferencial',
        'Protección contra sobretensiones',
        'Fusibles DC',
        'Interruptor de corte general'
      ],
      cableado: true,
      tierra: true
    };

    // Condiciones del tejado
    const condicionesTejado = [
      `Área mínima requerida: ${areaRequerida.toFixed(1)} m²`,
      `Orientación óptima: Sur (hemisferio sur) o Norte (hemisferio norte)`,
      `Inclinación recomendada: ${Math.abs(datos.ubicacion.includes('Bogotá') ? 4.6 : 5).toFixed(1)}° (latitud local)`,
      `Estructura debe soportar ${Math.ceil(potenciaTotalPaneles / areaPorPanel * 25)} kg/m²`,
      `Acceso seguro para mantenimiento`,
      `Sin sombras durante las horas pico de sol (10am-4pm)`
    ];

    // Análisis económico (precios en COP)
    const costoPorWp = 2500; // $2.500 COP por Wp instalado
    const costoInversor = potenciaInversor * 800000; // $800.000 por kW
    const costoEstructura = areaRequerida * 150000; // $150.000 por m² de estructura
    const costoInstalacion = potenciaTotalPaneles * 500000; // $500.000 por kW instalado
    
    let costoBaterias = 0;
    if (baterias) {
      costoBaterias = baterias.cantidad * 4500000; // $4.500.000 por batería estándar
    }

    const costoTotal = (potenciaTotalPaneles * costoPorWp) + costoInversor + costoEstructura + costoInstalacion + costoBaterias;

    // Ahorro anual (considerando $500 COP por kWh promedio)
    const precioKwh = 500;
    const ahorroAnual = datos.consumoMensual * 12 * precioKwh;

    const periodoRetorno = costoTotal / ahorroAnual;
    const roi = (ahorroAnual / costoTotal) * 100;

    const resultado: ResultadoSolar = {
      paneles: {
        cantidad: cantidadPaneles,
        potenciaUnitaria: potenciaPanel,
        potenciaTotal: potenciaTotalPaneles,
        areaRequerida: areaRequerida
      },
      inversor: {
        tipo: datos.tipoInversor.toUpperCase(),
        potencia: potenciaInversor,
        eficiencia: 95
      },
      baterias: baterias,
      sistemaProteccion: sistemaProteccion,
      condicionesTejado: condicionesTejado,
      analisisEconomico: {
        costoEstimado: costoTotal,
        ahorroAnual: ahorroAnual,
        periodoRetorno: periodoRetorno,
        roi: roi
      }
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