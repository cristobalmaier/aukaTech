document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const dateFilter = document.getElementById("dateFilter");
  const clearButton = document.getElementById("clearFilters");

  const rows = document.querySelectorAll(".calls-table tbody tr");

  function filtrarTabla() {
    const searchValue = searchInput.value.toLowerCase();
    const estado = statusFilter.value;
    const prioridad = priorityFilter.value;
    const fecha = dateFilter.value;

    rows.forEach(row => {
      const mensaje = row.querySelector(".call-message")?.textContent.toLowerCase() || "";
      const emisor = row.cells[2]?.textContent.toLowerCase() || "";
      const area = row.cells[1]?.textContent.toLowerCase() || "";
      const estadoTexto = row.querySelector(".status-badge")?.textContent.toLowerCase();
      const prioridadTexto = row.querySelector(".priority-badge")?.textContent.toLowerCase();
      const fechaTexto = row.querySelector(".call-date")?.textContent;

      const coincideBusqueda = mensaje.includes(searchValue) || emisor.includes(searchValue) || area.includes(searchValue);
      const coincideEstado = !estado || estadoTexto.includes(estado);
      const coincidePrioridad = !prioridad || prioridadTexto.includes(prioridad);
      const coincideFecha = !fecha || fechaTexto === fecha;

      if (coincideBusqueda && coincideEstado && coincidePrioridad && coincideFecha) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  [searchInput, statusFilter, priorityFilter, dateFilter].forEach(input => {
    input.addEventListener("input", filtrarTabla);
    input.addEventListener("change", filtrarTabla);
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "";
    priorityFilter.value = "";
    dateFilter.value = "";
    filtrarTabla();
  });
});

// Función para mostrar notificación
function mostrarNotificacion(tipo, mensaje) {
  const notificacion = document.getElementById('notificacion');
  const notificacionIcono = document.getElementById('notificacionIcono');
  const notificacionMensaje = document.getElementById('notificacionMensaje');

  notificacion.classList.remove('alerta-exito', 'alerta-error');
  notificacionIcono.className = '';

  if (tipo === 'exito') {
    notificacion.classList.add('alerta-exito');
    notificacionIcono.classList.add('fas', 'fa-check-circle');
  } else {
    notificacion.classList.add('alerta-error');
    notificacionIcono.classList.add('fas', 'fa-times-circle');
  }

  notificacionMensaje.textContent = mensaje;
  notificacion.style.display = 'flex';

  setTimeout(() => {
    notificacion.style.display = 'none';
  }, 3000);
}

// Exportar tabla a CSV
document.addEventListener('DOMContentLoaded', function () {
  const exportBtn = document.getElementById('boton-exportar');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      try {
        exportTableToCSV('solicitud.csv');
        mostrarNotificacion('exito', 'Exportación completada exitosamente');
      } catch (error) {
        console.error('Error al exportar:', error);
        mostrarNotificacion('error', 'Error al exportar los datos');
      }
    });
  }
});

function exportTableToCSV(filename) {
  const table = document.querySelector('.calls-table');
  if (!table) return;

  let csv = [];
  
  // Obtener encabezados
  const headers = ['Fecha', 'Hora', 'area', 'empleado', 'Mensaje', 'Estado', 'Prioridad'];
  csv.push(headers.join(','));

  // Obtener filas filtradas
  const rows = document.querySelectorAll('.calls-table tbody tr');
  rows.forEach(row => {
    if (row.style.display !== 'none') { // Solo exportar filas visibles
      let rowData = [];
      rowData.push(row.querySelector('.call-date')?.textContent || '');
      rowData.push(row.querySelector('.call-time')?.textContent || '');
      rowData.push(row.querySelector('.call-course')?.textContent || '');
      rowData.push(row.querySelector('.call-professor')?.textContent || '');
      rowData.push(row.querySelector('.call-message')?.textContent || '');
      rowData.push(row.querySelector('.status-badge')?.textContent || '');
      rowData.push(row.querySelector('.priority-badge')?.textContent || '');
      
      // Limpiar y formatear datos
      rowData = rowData.map(value => {
        return value.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
      });
      
      csv.push('"' + rowData.join('"","') + '"');
    }
  });

  // Verificar si hay datos para exportar
  if (csv.length <= 1) {
    throw new Error('No hay datos para exportar');
  }

  // Descargar archivo
  const csvFile = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Mostrar detalle del solicitud en modal

document.addEventListener('DOMContentLoaded', function () {
  // Botón cerrar modal
  const cerrarBtn = document.getElementById('cerrarDetallesolicitud');
  if (cerrarBtn) {
    cerrarBtn.onclick = function () {
      document.getElementById('detallesolicitudModal').style.display = 'none';
    };
  }

  // Botones de ojo en la tabla
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = btn.closest('tr');
      const detalle = {
        fecha: row.querySelector('.call-date')?.innerText || '',
        hora: row.querySelector('.call-time')?.innerText || '',
        area: row.querySelector('.call-grade')?.innerText || '',
        emisor: row.querySelector('.emisor')?.innerText || '',
        mensaje: row.querySelector('.call-message')?.innerText || '',
        estado: row.querySelector('.status-badge')?.innerText || '',
        estadoClass: row.querySelector('.status-badge')?.className || '',
        prioridad: row.querySelector('.priority-badge')?.innerText || '',
        prioridadClass: row.querySelector('.priority-badge')?.className || '',
        soporte: row.cells[6]?.innerText || '',
        tiempoRespuesta: row.cells[7]?.innerText || '-',
      };
      // Badge de estado
      let estadoBadge = `<span class="status-badge ${detalle.estadoClass.replace('status-badge', '').trim()}" style="font-size:13px;">${detalle.estado}</span>`;
      // Badge de prioridad
      let prioridadBadge = `<span class="priority-badge ${detalle.prioridadClass.replace('priority-badge', '').trim()}" style="font-size:13px;">${detalle.prioridad}</span>`;
      document.getElementById('detallesolicitudContenido').innerHTML = `
        <div>
          <div class="detalle-solicitud-titulo">Detalle del solicitud</div>
          <div class="detalle-solicitud-subtitulo">Información completa del solicitud</div>
          <div class="detalle-solicitud-flex">
            <div class="detalle-solicitud-col">
              <div class="detalle-solicitud-col-titulo">Información General</div>
              <div><b>Fecha:</b> ${detalle.fecha}</div>
              <div><b>Hora:</b> ${detalle.hora}</div>
              <div><b>area:</b> ${detalle.area}</div> 
              <div><b>Emisor:</b> ${detalle.emisor}</div>
            </div>
            <div class="detalle-solicitud-col">
              <div class="detalle-solicitud-col-titulo">Estado y Respuesta</div>
              <div><b>Estado:</b> ${estadoBadge}</div>
              <div><b>Prioridad:</b> ${prioridadBadge}</div>
              <div><b>soporte:</b> ${detalle.soporte}</div>
            </div>
          </div>
        </div>
        <hr class="detalle-solicitud-hr">
        <div class="detalle-solicitud-label">Mensaje Original</div>
        <div class="detalle-solicitud-mensaje">${detalle.mensaje}</div>
      `;
      document.getElementById('detallesolicitudModal').style.display = 'flex';
      // Si tienes prioridad y turno en los datos, puedes reemplazar los spans por los valores reales
    });
  });
});