import React from 'react';
import { Link, useParams } from 'react-router-dom';

const formatoPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

const WIN_ANSI_EXTRA = {
  '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86,
  '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c,
  'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95,
  '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b,
  'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f,
};

const textoPdf = (valor) => {
  const contenido = [...String(valor ?? '')].map((caracter) => {
    const codigo = caracter.codePointAt(0);
    const byte = codigo <= 0xff ? codigo : WIN_ANSI_EXTRA[caracter] ?? 0x3f;
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) return `\\${String.fromCharCode(byte)}`;
    if (byte < 0x20 || byte > 0x7e) return `\\${byte.toString(8).padStart(3, '0')}`;
    return String.fromCharCode(byte);
  }).join('');
  return `(${contenido})`;
};

const ajustarLinea = (valor, maxCaracteres = 82) => {
  const palabras = String(valor ?? '').split(/\s+/);
  const lineas = [];
  let linea = '';
  palabras.forEach((palabra) => {
    if (linea && `${linea} ${palabra}`.length > maxCaracteres) {
      lineas.push(linea);
      linea = palabra;
    } else {
      linea = linea ? `${linea} ${palabra}` : palabra;
    }
  });
  if (linea) lineas.push(linea);
  return lineas;
};

function descargarComprobante(resultado, direccion, piso) {
  const fecha = new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeStyle: 'short' })
    .format(new Date(resultado.fecha));
  const comandos = [];
  const escribir = (texto, x, y, tamano = 10, negrita = false, color = '0.18 0.10 0.06') => {
    comandos.push(`BT /${negrita ? 'F2' : 'F1'} ${tamano} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm ${textoPdf(texto)} Tj ET`);
  };
  const linea = (y) => comandos.push(`0.83 0.77 0.70 RG 0.7 w 42 ${y} m 553 ${y} l S`);
  let y = 800;

  escribir('MADERAS FINAS', 42, y, 12, true, '0.36 0.22 0.13');
  escribir('COMPROBANTE DE COMPRA', 42, y - 29, 20, true);
  escribir(`Nro. ${resultado.numero}`, 42, y - 48, 10, true, '0.36 0.22 0.13');
  escribir(fecha, 42, y - 64, 9, false, '0.40 0.36 0.32');
  linea(y - 78);
  y -= 103;

  escribir('DATOS DEL CLIENTE', 42, y, 12, true, '0.36 0.22 0.13');
  y -= 19;
  const datos = [
    ['Nombre', `${resultado.nombre || ''} ${resultado.apellidos || ''}`.trim()],
    ['Correo', resultado.email],
    ['Dirección', direccion],
    ['Piso', piso || '—'],
    ['Comuna y región', [resultado.comuna, resultado.region].filter(Boolean).join(', ')],
    ...(resultado.indicaciones ? [['Indicaciones', resultado.indicaciones]] : []),
  ];
  datos.forEach(([etiqueta, valor]) => {
    escribir(`${etiqueta}:`, 42, y, 9, true, '0.40 0.36 0.32');
    const lineas = ajustarLinea(valor || '—', 78);
    lineas.forEach((texto, indice) => escribir(texto, 142, y - (indice * 12), 9));
    y -= Math.max(19, lineas.length * 12 + 6);
  });

  y -= 7;
  linea(y);
  y -= 22;
  escribir('DETALLE DE COMPRA', 42, y, 12, true, '0.36 0.22 0.13');
  y -= 22;
  escribir('Producto', 42, y, 9, true);
  escribir('Precio', 340, y, 9, true);
  escribir('Cant.', 414, y, 9, true);
  escribir('Subtotal', 470, y, 9, true);
  y -= 8;
  linea(y);
  y -= 17;

  resultado.articulos.forEach((articulo) => {
    const nombreLineas = ajustarLinea(articulo.nombre, 43);
    nombreLineas.forEach((nombre, indice) => escribir(nombre, 42, y - (indice * 11), 9));
    escribir(formatoPrecio(articulo.precio), 340, y, 9);
    escribir(String(articulo.cantidad), 423, y, 9);
    escribir(formatoPrecio(articulo.precio * articulo.cantidad), 470, y, 9);
    y -= Math.max(20, nombreLineas.length * 11 + 6);
  });

  y -= 4;
  linea(y);
  y -= 27;
  escribir('TOTAL PAGADO', 360, y, 12, true, '0.36 0.22 0.13');
  escribir(formatoPrecio(resultado.total), 470, y, 12, true, '0.36 0.22 0.13');
  escribir('Gracias por tu compra.', 42, 42, 9, false, '0.40 0.36 0.32');

  const contenido = `${comandos.join('\n')}\n`;
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${contenido.length} >>\nstream\n${contenido}endstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objetos.forEach((objeto, indice) => {
    offsets.push(pdf.length);
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;

  const archivo = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  const numeroSeguro = String(resultado.numero).replace(/[^a-z0-9-]/gi, '-');
  enlace.href = url;
  enlace.download = `comprobante-${numeroSeguro}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function leerResultado() {
  try {
    return JSON.parse(localStorage.getItem('resultado_ultima_compra') || 'null');
  } catch {
    return null;
  }
}

export default function ResultadoCompra() {
  const { estado } = useParams();
  const resultado = leerResultado();
  const esValido = ['exitosa', 'fallida'].includes(estado) && resultado?.estado === estado;
  const exitosa = estado === 'exitosa' && esValido;

  if (!esValido) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h2 fw-bold">No hay un resultado de compra para mostrar</h1>
        <Link to="/productos" className="btn btn-madera mt-3">Volver a productos</Link>
      </main>
    );
  }

  const direccionPrincipal = resultado.direccion || resultado.calle || '';
  const piso = resultado.piso || resultado.departamento || '';
  const mensajeFallo = /prueba|demostraci[oó]n/i.test(resultado.motivoFallo || '')
    ? 'No se pudo completar el pago. Puedes volver a intentarlo.'
    : resultado.motivoFallo || 'El pago fue rechazado. Puedes volver a intentarlo.';
  const direccion = [direccionPrincipal, piso, resultado.comuna, resultado.region]
    .filter(Boolean)
    .join(', ');
  return (
    <main className="container py-5 checkout-page">
      <section className={`purchase-result ${exitosa ? 'purchase-result-success' : 'purchase-result-failure'}`} aria-live="polite">
        <header className="purchase-result-heading">
          <span className={`purchase-result-icon ${exitosa ? 'is-success' : 'is-failure'}`} aria-hidden="true">{exitosa ? '✓' : '×'}</span>
          <div>
            <h1>{exitosa ? 'Se ha realizado la compra.' : 'No se pudo realizar el pago.'}</h1>
            <p className="mb-0">Nro. {resultado.numero}</p>
          </div>
        </header>

        {!exitosa && <div className="alert alert-warning text-start" role="status">{mensajeFallo}</div>}
        <p className="text-muted purchase-result-caption">{exitosa ? 'Completa la siguiente información y guarda tu comprobante.' : 'Detalle de compra.'}</p>

        <div className="purchase-customer text-start">
          <div><span>Nombre</span><strong>{resultado.nombre}</strong></div>
          <div><span>Apellidos</span><strong>{resultado.apellidos}</strong></div>
          <div><span>Correo</span><strong>{resultado.email}</strong></div>
        </div>

        <section className="purchase-address text-start" aria-labelledby="purchase-address-title">
          <h2 id="purchase-address-title">Dirección de entrega de los productos</h2>
          <div className="purchase-address-grid">
            <div><span>Dirección</span><strong>{direccionPrincipal}</strong></div>
            <div><span>Piso</span><strong>{piso || '—'}</strong></div>
            <div><span>Región</span><strong>{resultado.region}</strong></div>
            <div><span>Comuna</span><strong>{resultado.comuna}</strong></div>
          </div>
          {resultado.indicaciones && <div className="purchase-notes"><span>Indicaciones para la entrega</span><p>{resultado.indicaciones}</p></div>}
        </section>

        <div className="table-responsive purchase-table-wrap">
          <table className="table align-middle mb-0">
            <thead><tr><th scope="col">Imagen</th><th scope="col">Nombre</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Subtotal</th></tr></thead>
            <tbody>
              {resultado.articulos.map((item) => (
                <tr key={item.codigo}>
                  <td><img className="checkout-product-image" src={`/img/productos/${item.imagen}`} alt={item.nombre} /></td>
                  <td>{item.nombre}</td>
                  <td className="text-nowrap">{formatoPrecio(item.precio)}</td>
                  <td>{item.cantidad}</td>
                  <td className="text-nowrap">{formatoPrecio(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="purchase-total"><span>Total pagado</span><strong>{formatoPrecio(resultado.total)}</strong></div>
        <div className="purchase-result-actions">
          {exitosa ? (
            <>
              <button type="button" className="btn btn-madera" onClick={() => descargarComprobante(resultado, direccionPrincipal, piso)}>Descargar comprobante en PDF</button>
              <Link to="/productos" className="btn btn-outline-madera">Seguir comprando</Link>
            </>
          ) : (
            <>
              <Link to="/checkout" className="btn btn-madera">Volver a realizar el pago</Link>
              <Link to="/carrito" className="btn btn-outline-madera">Revisar carrito</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
