import { NextRequest, NextResponse } from 'next/server';

interface ItemCotizacion {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  categoria: string;
}

interface DatosCotizacion {
  nombreProyecto: string;
  nombreCliente: string;
  fecha: string;
  items: ItemCotizacion[];
}

export async function POST(request: NextRequest) {
  try {
    const datos: DatosCotizacion = await request.json();

    // Validar datos de entrada
    if (!datos.nombreProyecto || !datos.items || datos.items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para la cotización' },
        { status: 400 }
      );
    }

    // Calcular totales
    const subtotal = datos.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    const iva = subtotal * 0.19; // 19% IVA en Colombia
    const total = subtotal + iva;

    // Agrupar por categoría
    const totalesPorCategoria = datos.items.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = 0;
      }
      acc[item.categoria] += item.cantidad * item.precioUnitario;
      return acc;
    }, {} as Record<string, number>);

    // Análisis de costos
    const analisis = {
      costoTotal: total,
      subtotal,
      iva,
      costoPromedioPorItem: total / datos.items.length,
      categoriaMasCostosa: Object.entries(totalesPorCategoria).reduce((a, b) => a[1] > b[1] ? a : b)[0],
      margenGananciaSugerido: total * 0.20, // 20% de margen sugerido
      precioVentaSugerido: total * 1.20
    };

    // Generar recomendaciones
    const recomendaciones = generarRecomendacionesCotizacion(datos.items, totalesPorCategoria, total);

    const resultado = {
      cotizacion: {
        ...datos,
        subtotal,
        iva,
        total,
        itemsConTotales: datos.items.map(item => ({
          ...item,
          total: item.cantidad * item.precioUnitario
        }))
      },
      analisis,
      totalesPorCategoria,
      recomendaciones,
      meta: {
        fechaGeneracion: new Date().toISOString(),
        version: '1.0',
        moneda: 'COP'
      }
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en análisis de cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function generarRecomendacionesCotizacion(
  items: ItemCotizacion[], 
  totalesPorCategoria: Record<string, number>, 
  total: number
): string[] {
  const recomendaciones: string[] = [];

  // Análisis de distribución de costos
  const costoManoObra = totalesPorCategoria['Mano de Obra'] || 0;
  const costoMateriales = Object.entries(totalesPorCategoria)
    .filter(([categoria]) => categoria !== 'Mano de Obra')
    .reduce((sum, [, costo]) => sum + costo, 0);

  const porcentajeManoObra = (costoManoObra / total) * 100;
  const porcentajeMateriales = (costoMateriales / total) * 100;

  if (porcentajeManoObra < 15) {
    recomendaciones.push('Considerar aumentar el porcentaje de mano de obra (actual: ' + porcentajeManoObra.toFixed(1) + '%)');
  }

  if (porcentajeManoObra > 35) {
    recomendaciones.push('El costo de mano de obra es elevado (actual: ' + porcentajeManoObra.toFixed(1) + '%). Evaluar optimización.');
  }

  // Análisis de componentes principales
  const costoPaneles = totalesPorCategoria['Paneles Solares'] || 0;
  const costoInversores = totalesPorCategoria['Inversores'] || 0;
  const costoBaterias = totalesPorCategoria['Baterías'] || 0;

  if (costoPaneles > total * 0.5) {
    recomendaciones.push('Los paneles solares representan más del 50% del costo. Considere opciones de mayor eficiencia.');
  }

  if (costoBaterias > total * 0.3) {
    recomendaciones.push('El sistema de almacenamiento es costoso. Evaluar alternativas o reducir autonomía.');
  }

  // Recomendaciones generales
  recomendaciones.push('Incluir 10-15% de contingencia para imprevistos');
  recomendaciones.push('Verificar garantías de los componentes principales');
  recomendaciones.push('Considerar capacitación técnica para el cliente');

  // Recomendaciones específicas según componentes
  if (items.some(item => item.descripcion.includes('Panel'))) {
    recomendaciones.push('Especificar tipo y eficiencia de los paneles en la cotización');
  }

  if (items.some(item => item.descripcion.includes('Inversor'))) {
    recomendaciones.push('Incluir certificación y normativa del inversor');
  }

  if (items.some(item => item.descripcion.includes('Batería'))) {
    recomendaciones.push('Especificar ciclos de vida y garantía de baterías');
  }

  return recomendaciones;
}