import { NextRequest, NextResponse } from 'next/server';

interface ItemCotizacion {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface DatosCotizacion {
  cliente: {
    nombre: string;
    ubicacion: string;
    contacto: string;
  };
  proyecto: {
    tipoInstalacion: string;
    tipoInversor: string;
    consumoMensual: number;
    hsp: number;
  };
  items: ItemCotizacion[];
  recomendaciones: string[];
  subtotal: number;
  iva: number;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const datos: DatosCotizacion = await request.json();

    // Validar datos mínimos
    if (!datos.items || datos.items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en la cotización' },
        { status: 400 }
      );
    }

    // Generar HTML para el PDF
    const htmlContent = generarHTMLCotizacion(datos);

    // En una implementación real, aquí se usaría una librería como puppeteer
    // Para este ejemplo, devolvemos el HTML que podría ser convertido a PDF
    return NextResponse.json({
      success: true,
      html: htmlContent,
      mensaje: 'Cotización generada correctamente'
    });

  } catch (error) {
    console.error('Error en generación de cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function generarHTMLCotizacion(datos: DatosCotizacion): string {
  const fechaActual = new Date().toLocaleDateString('es-CO');
  const numeroCotizacion = `COT-${Date.now()}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización Sistema Solar</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #ff6b35;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #ff6b35;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0 0 0;
        }
        .info-cliente {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-cliente h3 {
            color: #ff6b35;
            margin-top: 0;
        }
        .info-proyecto {
            background: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-proyecto h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #ff6b35;
            color: white;
            font-weight: bold;
        }
        .total-row {
            font-weight: bold;
            background: #f8f9fa;
        }
        .recomendaciones {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .recomendaciones h3 {
            color: #856404;
            margin-top: 0;
        }
        .recomendaciones ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .recomendaciones li {
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .logo {
            width: 120px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌞 COTIZACIÓN SISTEMA SOLAR</h1>
            <p><strong>Número:</strong> ${numeroCotizacion}</p>
            <p><strong>Fecha:</strong> ${fechaActual}</p>
            <p><strong>Vigencia:</strong> 30 días</p>
        </div>

        <div class="info-cliente">
            <h3>📍 Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${datos.cliente.nombre}</p>
            <p><strong>Ubicación:</strong> ${datos.cliente.ubicacion}</p>
            <p><strong>Contacto:</strong> ${datos.cliente.contacto}</p>
        </div>

        <div class="info-proyecto">
            <h3>⚡ Información del Proyecto</h3>
            <p><strong>Tipo de Instalación:</strong> ${datos.proyecto.tipoInstalacion}</p>
            <p><strong>Tipo de Inversor:</strong> ${datos.proyecto.tipoInversor}</p>
            <p><strong>Consumo Mensual:</strong> ${datos.proyecto.consumoMensual} kWh</p>
            <p><strong>Horas Sol Promedio:</strong> ${datos.proyecto.hsp} HSP</p>
        </div>

        <h3>📋 Detalle de Materiales y Servicios</h3>
        <table>
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario (COP)</th>
                    <th>Total (COP)</th>
                </tr>
            </thead>
            <tbody>
                ${datos.items.map(item => `
                    <tr>
                        <td>${item.descripcion}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precioUnitario.toLocaleString('es-CO')}</td>
                        <td>$${item.total.toLocaleString('es-CO')}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="3"><strong>SUBTOTAL</strong></td>
                    <td>$${datos.subtotal.toLocaleString('es-CO')}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3"><strong>IVA (19%)</strong></td>
                    <td>$${datos.iva.toLocaleString('es-CO')}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td><strong>$${datos.total.toLocaleString('es-CO')}</strong></td>
                </tr>
            </tbody>
        </table>

        <div class="recomendaciones">
            <h3>🔧 Recomendaciones de Montaje</h3>
            <ul>
                ${datos.recomendaciones.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            <p><strong>Notas:</strong></p>
            <p>• Los precios están expresados en pesos colombianos (COP)</p>
            <p>• La cotización incluye instalación y garantía</p>
            <p>• Tiempo de instalación estimado: 3-5 días hábiles</p>
            <p>• Se requiere 50% de anticipo para iniciar el proyecto</p>
            <br>
            <p><em>Gracias por confiar en nuestros servicios de energía solar</em></p>
        </div>
    </div>
</body>
</html>
  `;
}