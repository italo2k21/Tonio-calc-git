'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, DollarSign, TrendingUp, Calendar, Download, Plus, Trash2 } from 'lucide-react';

interface ReciboEnergia {
  id: string;
  periodo: string;
  consumoKwh: number;
  valorFactura: number;
  cargoFijo: number;
  cargoVariable: number;
  fecha: string;
}

export default function ModuleRecibo() {
  const [recibos, setRecibos] = useState<ReciboEnergia[]>([]);
  const [nuevoRecibo, setNuevoRecibo] = useState({
    periodo: '',
    consumoKwh: 0,
    valorFactura: 0,
    cargoFijo: 0,
    cargoVariable: 0,
    fecha: ''
  });

  const agregarRecibo = () => {
    if (!nuevoRecibo.periodo || nuevoRecibo.consumoKwh <= 0 || nuevoRecibo.valorFactura <= 0) return;

    const recibo: ReciboEnergia = {
      id: Date.now().toString(),
      ...nuevoRecibo
    };

    setRecibos(prev => [...prev, recibo]);
    setNuevoRecibo({
      periodo: '',
      consumoKwh: 0,
      valorFactura: 0,
      cargoFijo: 0,
      cargoVariable: 0,
      fecha: ''
    });
  };

  const eliminarRecibo = (id: string) => {
    setRecibos(prev => prev.filter(recibo => recibo.id !== id));
  };

  const exportarPDF = () => {
    if (recibos.length === 0) {
      alert('No hay facturas para exportar');
      return;
    }

    try {
      // Crear una ventana nueva para imprimir
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Por favor, permita las ventanas emergentes para exportar el PDF');
        return;
      }

      // Generar HTML completo
      const contenidoHTML = generarHTMLRecibos();
      
      const printHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Historial de Facturas de Energía</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
              line-height: 1.6;
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
              margin: 5px 0;
              font-size: 14px;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .summary-item {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
            }
            .summary-item:nth-child(2) {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .summary-item:nth-child(3) {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }
            .summary-item:nth-child(4) {
              background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            }
            .summary-label {
              font-size: 12px;
              opacity: 0.9;
              margin-bottom: 5px;
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .summary-unit {
              font-size: 12px;
              opacity: 0.9;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
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
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .print-button {
              background: #ff6b35;
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
              .summary-item { 
                background: #f8f9fa !important;
                color: #333 !important;
                border: 1px solid #ddd;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="print-button" onclick="window.print()">
              🖨️ Imprimir / Guardar como PDF
            </button>
          </div>
          
          ${contenidoHTML}

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

  const generarHTMLRecibos = () => {
    const fechaActual = new Date().toLocaleDateString('es-CO');
    const totalConsumo = recibos.reduce((sum, recibo) => sum + recibo.consumoKwh, 0);
    const totalFacturado = recibos.reduce((sum, recibo) => sum + recibo.valorFactura, 0);
    const promedioKwh = totalConsumo > 0 ? totalFacturado / totalConsumo : 0;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial de Facturas de Energía</title>
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
            margin: 5px 0;
            font-size: 14px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .summary-item:nth-child(2) {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .summary-item:nth-child(3) {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .summary-item:nth-child(4) {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        .summary-label {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .summary-unit {
            font-size: 12px;
            opacity: 0.9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
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
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 HISTORIAL DE FACTURAS DE ENERGÍA</h1>
            <p><strong>Fecha de generación:</strong> ${fechaActual}</p>
            <p><strong>Total de registros:</strong> ${recibos.length} facturas</p>
        </div>

        <div class="summary">
            <div class="summary-item">
                <div class="summary-label">CONSUMO TOTAL</div>
                <div class="summary-value">${totalConsumo.toLocaleString('es-CO')}</div>
                <div class="summary-unit">kWh</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">TOTAL FACTURADO</div>
                <div class="summary-value">$${totalFacturado.toLocaleString('es-CO')}</div>
                <div class="summary-unit">COP</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">CONSUMO PROMEDIO</div>
                <div class="summary-value">${recibos.length > 0 ? (totalConsumo / recibos.length).toFixed(0) : 0}</div>
                <div class="summary-unit">kWh/mes</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">COSTO PROMEDIO/kWh</div>
                <div class="summary-value">$${promedioKwh.toFixed(0)}</div>
                <div class="summary-unit">COP/kWh</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>PERÍODO</th>
                    <th class="text-center">CONSUMO (kWh)</th>
                    <th class="text-center">VALOR FACTURA</th>
                    <th class="text-center">CARGO FIJO</th>
                    <th class="text-center">CARGO VARIABLE</th>
                    <th class="text-center">COSTO/kWh</th>
                    <th class="text-center">FECHA</th>
                </tr>
            </thead>
            <tbody>
                ${recibos.map(recibo => {
                  const costoKwh = recibo.consumoKwh > 0 ? recibo.valorFactura / recibo.consumoKwh : 0;
                  return `
                <tr>
                    <td><strong>${recibo.periodo}</strong></td>
                    <td class="text-center">${recibo.consumoKwh} kWh</td>
                    <td class="text-right">$${recibo.valorFactura.toLocaleString('es-CO')}</td>
                    <td class="text-right">$${recibo.cargoFijo.toLocaleString('es-CO')}</td>
                    <td class="text-right">$${recibo.cargoVariable.toLocaleString('es-CO')}</td>
                    <td class="text-center">$${costoKwh.toFixed(0)}</td>
                    <td class="text-center">${recibo.fecha || 'N/A'}</td>
                </tr>
                  `;
                }).join('')}
            </tbody>
        </table>

        <div class="footer">
            <p><strong>Calculadora Solar Profesional</strong> - Sistema de Análisis de Consumo Energético</p>
            <p>Generado el ${fechaActual} | Total de ${recibos.length} registros analizados</p>
            <p>💡 Este reporte ayuda a dimensionar sistemas de energía solar con base en su consumo real</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  // Calcular estadísticas
  const totalConsumo = recibos.reduce((sum, recibo) => sum + recibo.consumoKwh, 0);
  const promedioConsumo = recibos.length > 0 ? totalConsumo / recibos.length : 0;
  const totalFacturado = recibos.reduce((sum, recibo) => sum + recibo.valorFactura, 0);
  const promedioFactura = recibos.length > 0 ? totalFacturado / recibos.length : 0;
  const costoPromedioKwh = totalConsumo > 0 ? totalFacturado / totalConsumo : 0;

  // Obtener el último recibo para análisis
  const ultimoRecibo = recibos.length > 0 ? recibos[recibos.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Resumen de Facturación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Consumo Promedio</p>
                <p className="text-2xl font-bold">{promedioConsumo.toFixed(0)} kWh</p>
                <p className="text-blue-100 text-xs">Por período</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Factura Promedio</p>
                <p className="text-2xl font-bold">${promedioFactura.toLocaleString('es-CO')}</p>
                <p className="text-green-100 text-xs">Pesos colombianos</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Costo/kWh Promedio</p>
                <p className="text-2xl font-bold">${costoPromedioKwh.toFixed(0)}</p>
                <p className="text-orange-100 text-xs">Por unidad</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Registros</p>
                <p className="text-2xl font-bold">{recibos.length}</p>
                <p className="text-purple-100 text-xs">Facturas cargadas</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Ingreso */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ingresar Factura de Energía
          </CardTitle>
          <CardDescription className="text-orange-50">
            Registre los datos de su factura mensual de energía
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="periodo">Período de Facturación</Label>
              <Input
                id="periodo"
                value={nuevoRecibo.periodo}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, periodo: e.target.value }))}
                placeholder="Ej: Enero 2024"
              />
            </div>
            <div>
              <Label htmlFor="consumo">Consumo (kWh)</Label>
              <Input
                id="consumo"
                type="number"
                min="0"
                value={nuevoRecibo.consumoKwh || ''}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, consumoKwh: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor Total Factura ($)</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                value={nuevoRecibo.valorFactura || ''}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, valorFactura: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="cargoFijo">Cargo Fijo ($)</Label>
              <Input
                id="cargoFijo"
                type="number"
                min="0"
                value={nuevoRecibo.cargoFijo || ''}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, cargoFijo: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="cargoVariable">Cargo Variable ($)</Label>
              <Input
                id="cargoVariable"
                type="number"
                min="0"
                value={nuevoRecibo.cargoVariable || ''}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, cargoVariable: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha de Factura</Label>
              <Input
                id="fecha"
                type="date"
                value={nuevoRecibo.fecha}
                onChange={(e) => setNuevoRecibo(prev => ({ ...prev, fecha: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={agregarRecibo} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Factura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Facturas */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico de Facturas
              </CardTitle>
              <CardDescription className="text-orange-50">
                Registro histórico del consumo y facturación
              </CardDescription>
            </div>
            {recibos.length > 0 && (
              <Button 
                variant="outline" 
                className="bg-white text-orange-600 hover:bg-orange-50"
                onClick={exportarPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {recibos.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No hay facturas registradas</p>
              <p className="text-sm">Ingrese los datos de su factura para comenzar el análisis</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-center">Consumo (kWh)</TableHead>
                  <TableHead className="text-center">Valor Factura</TableHead>
                  <TableHead className="text-center">Cargo Fijo</TableHead>
                  <TableHead className="text-center">Cargo Variable</TableHead>
                  <TableHead className="text-center">Costo/kWh</TableHead>
                  <TableHead className="text-center">Fecha</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recibos.map((recibo) => {
                  const costoKwh = recibo.consumoKwh > 0 ? recibo.valorFactura / recibo.consumoKwh : 0;
                  return (
                    <TableRow key={recibo.id}>
                      <TableCell className="font-medium">{recibo.periodo}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{recibo.consumoKwh} kWh</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        ${recibo.valorFactura.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-center">
                        ${recibo.cargoFijo.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-center">
                        ${recibo.cargoVariable.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">${costoKwh.toFixed(0)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {recibo.fecha || 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarRecibo(recibo.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Análisis del Último Período */}
      {ultimoRecibo && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <TrendingUp className="w-5 h-5" />
              Análisis del Último Período: {ultimoRecibo.periodo}
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Desglose detallado del consumo y costos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Consumo Total</p>
                <p className="text-3xl font-bold text-indigo-700">{ultimoRecibo.consumoKwh}</p>
                <p className="text-sm text-slate-500">kWh</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Valor Total</p>
                <p className="text-3xl font-bold text-green-700">${ultimoRecibo.valorFactura.toLocaleString('es-CO')}</p>
                <p className="text-sm text-slate-500">COP</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Costo por kWh</p>
                <p className="text-3xl font-bold text-orange-700">${(ultimoRecibo.valorFactura / ultimoRecibo.consumoKwh).toFixed(0)}</p>
                <p className="text-sm text-slate-500">COP/kWh</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Consumo Diario Promedio</p>
                <p className="text-3xl font-bold text-purple-700">{(ultimoRecibo.consumoKwh / 30).toFixed(1)}</p>
                <p className="text-sm text-slate-500">kWh/día</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}