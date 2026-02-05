'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, Plus, Trash2, Download, FileText, Calculator, DollarSign, Save, Eye, Upload, User, Building } from 'lucide-react';

interface ItemCotizacion {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  categoria: string;
}

const categoriasItems = [
  'Paneles Solares',
  'Inversores',
  'Baterías',
  'Estructuras',
  'Cableado',
  'Protecciones',
  'Mano de Obra',
  'Otros'
];

const itemsPredefinidos = [
  { descripcion: 'Panel Solar 550Wp Monocristalino', categoria: 'Paneles Solares', precioSugerido: 1200000 },
  { descripcion: 'Inversor Híbrido 5000VA', categoria: 'Inversores', precioSugerido: 3500000 },
  { descripcion: 'Batería Litio 48V 100Ah', categoria: 'Baterías', precioSugerido: 2800000 },
  { descripcion: 'Estructura Montaje Teja', categoria: 'Estructuras', precioSugerido: 450000 },
  { descripcion: 'Cable Solar 6mm', categoria: 'Cableado', precioSugerido: 15000 },
  { descripcion: 'Breaker DC 32A', categoria: 'Protecciones', precioSugerido: 85000 },
  { descripcion: 'DPS Tipo 2', categoria: 'Protecciones', precioSugerido: 120000 },
  { descripcion: 'Mano de Obra Instalación', categoria: 'Mano de Obra', precioSugerido: 1500000 }
];

export default function ModuleAnalisis() {
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    categoria: 'Paneles Solares'
  });
  const [nombreProyecto, setNombreProyecto] = useState('Proyecto Solar Residencial');
  const [nombreCliente, setNombreCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  // Datos de la empresa
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombreEmpresa: 'Solar Energy Solutions SAS',
    nit: '900.123.456-7',
    direccion: 'Calle 123 #45-67, Bogotá, Colombia',
    telefono: '+57 1 234 5678',
    correo: 'contacto@solarenergy.com',
    paginaWeb: 'www.solarenergy.com',
    regimen: 'Común'
  });

  // Datos del cliente para la cotización
  const [datosClienteCotizacion, setDatosClienteCotizacion] = useState({
    nombreClienteCotizacion: '',
    identificacion: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    correo: ''
  });

  const cargarBorrador = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const borradorData = JSON.parse(e.target?.result as string);
        
        // Cargar los datos del borrador
        setNombreProyecto(borradorData.nombreProyecto || 'Proyecto Solar Residencial');
        setNombreCliente(borradorData.nombreCliente || '');
        setFecha(borradorData.fecha || new Date().toISOString().split('T')[0]);
        setItems(borradorData.items || []);
        
        alert('✅ Borrador cargado exitosamente');
      } catch (error) {
        console.error('Error cargando borrador:', error);
        alert('❌ Error al cargar el borrador. El archivo podría estar dañado.');
      }
    };
    reader.readAsText(file);
  };

  const agregarItem = () => {
    if (!nuevoItem.descripcion || nuevoItem.precioUnitario <= 0) return;

    const item: ItemCotizacion = {
      id: Date.now().toString(),
      ...nuevoItem,
      total: nuevoItem.cantidad * nuevoItem.precioUnitario
    };

    setItems(prev => [...prev, item]);
    setNuevoItem({
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      categoria: 'Paneles Solares'
    });
    setDialogOpen(false);
  };

  const eliminarItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const actualizarItem = (id: string, campo: keyof ItemCotizacion, valor: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const actualizado = { ...item, [campo]: valor };
        if (campo === 'cantidad' || campo === 'precioUnitario') {
          actualizado.total = actualizado.cantidad * actualizado.precioUnitario;
        }
        return actualizado;
      }
      return item;
    }));
  };

  const seleccionarPredefinido = (predefinido: any) => {
    setNuevoItem(prev => ({
      ...prev,
      descripcion: predefinido.descripcion,
      categoria: predefinido.categoria,
      precioUnitario: predefinido.precioSugerido
    }));
  };

  // Cálculos financieros
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const iva = subtotal * 0.19; // 19% IVA en Colombia
  const total = subtotal + iva;

  // Agrupar por categoría para análisis
  const totalesPorCategoria = items.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = 0;
    }
    acc[item.categoria] += item.total;
    return acc;
  }, {} as Record<string, number>);

  const guardarBorrador = () => {
    if (items.length === 0) {
      alert('No hay items para guardar en el borrador');
      return;
    }

    try {
      // Crear objeto con los datos de la cotización
      const borradorData = {
        nombreProyecto,
        nombreCliente,
        fecha,
        items: items,
        subtotal,
        iva,
        total,
        fechaGuardado: new Date().toISOString()
      };

      // Convertir a JSON string
      const jsonData = JSON.stringify(borradorData, null, 2);
      
      // Crear blob para descargar
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace temporal para descargar
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `borrador-cotizacion-${nombreProyecto.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      
      // Limpiar URL
      URL.revokeObjectURL(url);
      
      // Mostrar confirmación
      alert('✅ Borrador guardado exitosamente');
      
    } catch (error) {
      console.error('Error guardando borrador:', error);
      alert('❌ Error al guardar el borrador. Por favor, intente nuevamente.');
    }
  };

  const generarPDF = async () => {
    if (items.length === 0) {
      alert('❌ Por favor, agregue al menos un item antes de exportar a PDF');
      return;
    }

    try {
      // Crear una ventana nueva para imprimir
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Por favor, permita las ventanas emergentes para generar el PDF');
        return;
      }

      // Generar HTML simple sin colores oklch
      const printHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cotización Solar - ${nombreProyecto}</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 20px;
              color: #1e293b;
              background: white;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #ea580c;
              padding-bottom: 20px;
            }
            .company-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
              border-left: 4px solid #ea580c;
            }
            .client-info {
              background: #fff7ed;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
              border-left: 4px solid #10b981;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 10px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #374151;
              margin-bottom: 3px;
            }
            .info-value {
              color: #1f2937;
            }
            h1 {
              color: #ea580c;
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            h2 {
              color: #1e293b;
              margin: 10px 0 0 0;
              font-size: 20px;
            }
            .meta-info {
              color: #64748b;
              margin-top: 5px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #fed7aa;
              font-weight: bold;
              color: #1e293b;
            }
            .text-center {
              text-align: center;
            }
            .font-bold {
              font-weight: bold;
            }
            .text-xl {
              font-size: 1.25rem;
            }
            .summary {
              margin-top: 20px;
              padding: 20px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-row {
              border-top: 2px solid #ea580c;
              padding-top: 8px;
              margin-top: 8px;
              font-size: 18px;
              font-weight: bold;
              color: #ea580c;
            }
            .recommendations {
              margin-top: 30px;
              padding: 20px;
              background-color: #fff7ed;
              border: 1px solid #fed7aa;
              border-radius: 8px;
            }
            .recommendations h3 {
              color: #ea580c;
              margin-top: 0;
              margin-bottom: 10px;
            }
            .recommendations ul {
              margin: 0;
              padding-left: 20px;
            }
            .recommendations li {
              margin-bottom: 5px;
              color: #9a3412;
              font-size: 14px;
            }
            .notes {
              margin-top: 20px;
              padding: 15px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              font-size: 12px;
              color: #64748b;
            }
            .print-button {
              background: #ea580c;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              margin-bottom: 20px;
              display: inline-block;
            }
            .print-button:hover {
              background: #dc2626;
            }
            @media print {
              body { margin: 10px; }
              .no-print { display: none !important; }
              .print-button { display: none !important; }
              table { font-size: 10px; }
              th, td { padding: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="print-button" onclick="window.print()">
              🖨️ Imprimir / Guardar como PDF
            </button>
          </div>
          
          <div class="header">
            <h1>🌞 COTIZACIÓN SISTEMA SOLAR</h1>
            <h2>${nombreProyecto}</h2>
            <div class="meta-info">
              Fecha: ${new Date(fecha).toLocaleDateString('es-CO')}
              ${nombreCliente ? `<br>Cliente: ${nombreCliente}` : ''}
            </div>
          </div>

          <div class="company-info">
            <h3>🏢 DATOS DE LA EMPRESA</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <div class="info-value">${datosEmpresa.nombreEmpresa}</div>
              </div>
              <div class="info-item">
                <div class="info-label">NIT:</div>
                <div class="info-value">${datosEmpresa.nit}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Dirección:</div>
                <div class="info-value">${datosEmpresa.direccion}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono:</div>
                <div class="info-value">${datosEmpresa.telefono}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Correo:</div>
                <div class="info-value">${datosEmpresa.correo}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Página Web:</div>
                <div class="info-value">${datosEmpresa.paginaWeb}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Régimen:</div>
                <div class="info-value">${datosEmpresa.regimen}</div>
              </div>
            </div>
          </div>

          <div class="client-info">
            <h3>👤 DATOS DEL CLIENTE</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <div class="info-value">${datosClienteCotizacion.nombreClienteCotizacion || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Identificación:</div>
                <div class="info-value">${datosClienteCotizacion.identificacion || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Dirección:</div>
                <div class="info-value">${datosClienteCotizacion.direccion || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ciudad:</div>
                <div class="info-value">${datosClienteCotizacion.ciudad || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono:</div>
                <div class="info-value">${datosClienteCotizacion.telefono || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Correo Electrónico:</div>
                <div class="info-value">${datosClienteCotizacion.correo || 'N/A'}</div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th class="text-center">Categoría</th>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Precio Unitario</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => `
                <tr>
                  <td>${item.descripcion}</td>
                  <td class="text-center">${item.categoria}</td>
                  <td class="text-center">${item.cantidad}</td>
                  <td class="text-center">$${item.precioUnitario.toLocaleString('es-CO')}</td>
                  <td class="text-center font-bold">$${item.total.toLocaleString('es-CO')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>$${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div class="summary-row">
              <span>IVA (19%):</span>
              <span>$${iva.toLocaleString('es-CO')}</span>
            </div>
            <div class="summary-row total-row">
              <span>TOTAL:</span>
              <span>$${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div class="recommendations">
            <h3>Recomendaciones de Montaje:</h3>
            <ul>
              <li>Realizar instalación por personal certificado</li>
              <li>Verificar estructura del tejado antes de la instalación</li>
              <li>Implementar sistema de monitoreo de rendimiento</li>
              <li>Programar mantenimiento cada 6 meses</li>
              <li>Considerar expansión futura del sistema</li>
            </ul>
          </div>

          <div class="notes">
            <strong>Notas:</strong> Los precios están expresados en pesos colombianos (COP). 
            La cotización tiene vigencia de 30 días. Los tiempos de entrega pueden variar según disponibilidad de stock.
          </div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1000);
            }
          </script>
        </body>
        </html>
      `;

      // Escribir el contenido en la nueva ventana
      printWindow.document.write(printHTML);
      printWindow.document.close();

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  const exportarExcel = () => {
    if (items.length === 0) {
      alert('No hay items para exportar a Excel');
      return;
    }

    try {
      // Crear contenido CSV (compatible con Excel)
      let csvContent = '\ufeff'; // BOM para UTF-8
      csvContent += 'COTIZACIÓN SOLAR - ' + nombreProyecto + '\n\n';
      csvContent += 'Datos del Proyecto\n';
      csvContent += 'Nombre del Proyecto,' + nombreProyecto + '\n';
      csvContent += 'Nombre del Cliente,' + (nombreCliente || 'N/A') + '\n';
      csvContent += 'Fecha,' + fecha + '\n';
      csvContent += 'Fecha de Guardado,' + new Date().toLocaleString('es-CO') + '\n\n';
      
      csvContent += 'Resumen Financiero\n';
      csvContent += 'Subtotal,$' + subtotal.toLocaleString('es-CO') + '\n';
      csvContent += 'IVA (19%),$' + iva.toLocaleString('es-CO') + '\n';
      csvContent += 'TOTAL,$' + total.toLocaleString('es-CO') + '\n\n';
      
      csvContent += 'Detalle de Items\n';
      csvContent += 'Categoría,Descripción,Cantidad,Precio Unitario,Precio Unitario (COP),Total (COP)\n';
      
      items.forEach(item => {
        csvContent += [
          item.categoria,
          item.descripcion,
          item.cantidad,
          '$' + item.precioUnitario.toLocaleString('es-CO'),
          '$' + item.total.toLocaleString('es-CO')
        ].join(',') + '\n';
      });
      
      // Crear blob para descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace temporal para descargar
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `cotizacion-excel-${nombreProyecto.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      
      // Limpiar URL
      URL.revokeObjectURL(url);
      
      // Mostrar confirmación
      alert('✅ Archivo Excel exportado exitosamente');
      
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      alert('❌ Error al exportar a Excel. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Información de la Empresa y Cliente */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información de Cotización
          </CardTitle>
          <CardDescription className="text-blue-50">
            Complete los datos de la empresa y cliente para la cotización profesional
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Datos de la Empresa */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Datos de la Empresa
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                  <Input
                    id="nombreEmpresa"
                    value={datosEmpresa.nombreEmpresa}
                    onChange={(e) => setDatosEmpresa(prev => ({ ...prev, nombreEmpresa: e.target.value }))}
                    placeholder="Ej: Solar Energy Solutions SAS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="nit">NIT</Label>
                    <Input
                      id="nit"
                      value={datosEmpresa.nit}
                      onChange={(e) => setDatosEmpresa(prev => ({ ...prev, nit: e.target.value }))}
                      placeholder="900.123.456-7"
                    />
                  </div>
                  <div>
                    <Label htmlFor="regimen">Régimen</Label>
                    <select
                      id="regimen"
                      value={datosEmpresa.regimen}
                      onChange={(e) => setDatosEmpresa(prev => ({ ...prev, regimen: e.target.value }))}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Común">Común</option>
                      <option value="Simplificado">Simplificado</option>
                      <option value="Gran Contribuyente">Gran Contribuyente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccionEmpresa">Dirección</Label>
                  <Input
                    id="direccionEmpresa"
                    value={datosEmpresa.direccion}
                    onChange={(e) => setDatosEmpresa(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Calle 123 #45-67, Ciudad, País"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="telefonoEmpresa">Teléfono</Label>
                    <Input
                      id="telefonoEmpresa"
                      value={datosEmpresa.telefono}
                      onChange={(e) => setDatosEmpresa(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+57 1 234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="correoEmpresa">Correo Electrónico</Label>
                    <Input
                      id="correoEmpresa"
                      type="email"
                      value={datosEmpresa.correo}
                      onChange={(e) => setDatosEmpresa(prev => ({ ...prev, correo: e.target.value }))}
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paginaWeb">Página Web</Label>
                  <Input
                    id="paginaWeb"
                    value={datosEmpresa.paginaWeb}
                    onChange={(e) => setDatosEmpresa(prev => ({ ...prev, paginaWeb: e.target.value }))}
                    placeholder="www.empresa.com"
                  />
                </div>
              </div>
            </div>

            {/* Datos del Cliente para Cotización */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                Datos del Cliente
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nombreClienteCotizacion">Nombre del Cliente</Label>
                  <Input
                    id="nombreClienteCotizacion"
                    value={datosClienteCotizacion.nombreClienteCotizacion}
                    onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, nombreClienteCotizacion: e.target.value }))}
                    placeholder="Nombre completo del cliente"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="identificacion">Identificación</Label>
                    <Input
                      id="identificacion"
                      value={datosClienteCotizacion.identificacion}
                      onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, identificacion: e.target.value }))}
                      placeholder="C.C. o NIT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={datosClienteCotizacion.ciudad}
                      onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, ciudad: e.target.value }))}
                      placeholder="Bogotá, Medellín, etc."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccionCliente">Dirección</Label>
                  <Input
                    id="direccionCliente"
                    value={datosClienteCotizacion.direccion}
                    onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Dirección completa del cliente"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="telefonoCliente">Teléfono</Label>
                    <Input
                      id="telefonoCliente"
                      value={datosClienteCotizacion.telefono}
                      onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="correoCliente">Correo Electrónico</Label>
                    <Input
                      id="correoCliente"
                      type="email"
                      value={datosClienteCotizacion.correo}
                      onChange={(e) => setDatosClienteCotizacion(prev => ({ ...prev, correo: e.target.value }))}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Proyecto */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información de la Cotización
          </CardTitle>
          <CardDescription className="text-orange-50">
            Complete los datos del proyecto para generar la cotización profesional
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nombreProyecto">Nombre del Proyecto</Label>
              <Input
                id="nombreProyecto"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                placeholder="Ej: Instalación Solar Casa Familia Pérez"
              />
            </div>
            <div>
              <Label htmlFor="nombreCliente">Nombre del Cliente</Label>
              <Input
                id="nombreCliente"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Nombre completo del cliente"
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha de Cotización</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Subtotal</p>
                <p className="text-2xl font-bold">${subtotal.toLocaleString('es-CO')}</p>
                <p className="text-blue-100 text-xs">Sin impuestos</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">IVA (19%)</p>
                <p className="text-2xl font-bold">${iva.toLocaleString('es-CO')}</p>
                <p className="text-green-100 text-xs">Impuesto</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total</p>
                <p className="text-2xl font-bold">${total.toLocaleString('es-CO')}</p>
                <p className="text-orange-100 text-xs">Valor final</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="text-purple-100 text-xs">Total items</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de Items */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Items de la Cotización
              </CardTitle>
              <CardDescription className="text-orange-50">
                Agregue los materiales y servicios para el proyecto
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Item</DialogTitle>
                  <DialogDescription>
                    Seleccione un item predefinido o configure uno personalizado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Selección Rápida */}
                  <div>
                    <Label className="text-sm font-medium">Items Predefinidos</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {itemsPredefinidos.map((predefinido, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => seleccionarPredefinido(predefinido)}
                          className="text-left justify-start h-auto py-2 px-3"
                        >
                          <div>
                            <div className="font-medium text-xs">{predefinido.descripcion}</div>
                            <div className="text-xs text-slate-500">
                              ${predefinido.precioSugerido.toLocaleString('es-CO')}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Formulario */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="descripcion">Descripción del Item</Label>
                      <Input
                        id="descripcion"
                        value={nuevoItem.descripcion}
                        onChange={(e) => setNuevoItem(prev => ({ ...prev, descripcion: e.target.value }))}
                        placeholder="Ej: Panel Solar 550Wp Monocristalino"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <select
                        id="categoria"
                        value={nuevoItem.categoria}
                        onChange={(e) => setNuevoItem(prev => ({ ...prev, categoria: e.target.value }))}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {categoriasItems.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="1"
                        value={nuevoItem.cantidad}
                        onChange={(e) => setNuevoItem(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="precio">Precio Unitario (COP)</Label>
                      <Input
                        id="precio"
                        type="number"
                        min="0"
                        value={nuevoItem.precioUnitario || ''}
                        onChange={(e) => setNuevoItem(prev => ({ ...prev, precioUnitario: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={agregarItem}>
                      Agregar Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No hay items agregados</p>
              <p className="text-sm">Haga clic en "Agregar Item" para comenzar la cotización</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Categoría</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Precio Unitario</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.descripcion}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{item.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(item.id, 'cantidad', Number(e.target.value))}
                        className="w-20 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0"
                        value={item.precioUnitario}
                        onChange={(e) => actualizarItem(item.id, 'precioUnitario', Number(e.target.value))}
                        className="w-32 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      ${item.total.toLocaleString('es-CO')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarItem(item.id)}
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

      {/* Análisis por Categoría */}
      {items.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis por Categoría
            </CardTitle>
            <CardDescription className="text-orange-50">
              Distribución de costos por tipo de material o servicio
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(totalesPorCategoria).map(([categoria, total]) => {
                const porcentaje = (total / subtotal) * 100;
                return (
                  <div key={categoria} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{categoria}</span>
                      <div className="text-right">
                        <span className="font-semibold">${total.toLocaleString('es-CO')}</span>
                        <span className="text-sm text-slate-500 ml-2">({porcentaje.toFixed(1)}%)</span>
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

      {/* Vista Previa y Exportación */}
      {items.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Vista Previa y Exportación
                </CardTitle>
                <CardDescription className="text-green-50">
                  Vista previa de la cotización y opciones de exportación
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={guardarBorrador} variant="outline" className="bg-white text-green-600 hover:bg-green-50">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Borrador
                </Button>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={cargarBorrador}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Cargar borrador"
                  />
                  <Upload className="w-4 h-4 mr-2" />
                  Cargar Borrador
                </Button>
                <Button onClick={generarPDF} className="bg-white text-green-600 hover:bg-green-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button onClick={exportarExcel} className="bg-white text-blue-600 hover:bg-blue-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div id="cotizacion-content" className="bg-white p-8 rounded-lg shadow-sm">
              {/* Encabezado */}
              <div className="text-center mb-8 border-b-2 border-orange-500 pb-4">
                <h1 className="text-3xl font-bold text-slate-800">COTIZACIÓN PROYECTO SOLAR</h1>
                <h2 className="text-xl text-slate-600 mt-2">{nombreProyecto}</h2>
                <p className="text-slate-500 mt-1">Fecha: {new Date(fecha).toLocaleDateString('es-CO')}</p>
                {nombreCliente && <p className="text-slate-500">Cliente: {nombreCliente}</p>}
              </div>

              {/* Tabla de Items */}
              <Table className="mb-6">
                <TableHeader>
                  <TableRow className="bg-slate-100">
                    <TableHead className="font-bold">Descripción</TableHead>
                    <TableHead className="text-center font-bold">Categoría</TableHead>
                    <TableHead className="text-center font-bold">Cantidad</TableHead>
                    <TableHead className="text-center font-bold">Precio Unitario</TableHead>
                    <TableHead className="text-center font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell className="text-center">{item.categoria}</TableCell>
                      <TableCell className="text-center">{item.cantidad}</TableCell>
                      <TableCell className="text-center">${item.precioUnitario.toLocaleString('es-CO')}</TableCell>
                      <TableCell className="text-center font-semibold">${item.total.toLocaleString('es-CO')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Resumen Financiero */}
              <div className="border-t-2 border-slate-300 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Subtotal:</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">IVA (19%):</span>
                  <span>${iva.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-orange-600 border-t-2 border-orange-300 pt-2">
                  <span>TOTAL:</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-bold text-orange-800 mb-2">Recomendaciones de Montaje:</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Realizar instalación por personal certificado</li>
                  <li>• Verificar estructura del tejado antes de la instalación</li>
                  <li>• Implementar sistema de monitoreo de rendimiento</li>
                  <li>• Programar mantenimiento cada 6 meses</li>
                  <li>• Considerar expansión futura del sistema</li>
                </ul>
              </div>

              {/* Notas */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600">
                  <strong>Notas:</strong> Los precios están expresados en pesos colombianos (COP). 
                  La cotización tiene vigencia de 30 días. Los tiempos de entrega pueden variar según disponibilidad de stock.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}