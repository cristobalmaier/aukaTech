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
      const curso = row.cells[1]?.textContent.toLowerCase() || "";
      const estadoTexto = row.querySelector(".status-badge")?.textContent.toLowerCase();
      const prioridadTexto = row.querySelector(".priority-badge")?.textContent.toLowerCase();
      const fechaTexto = row.querySelector(".call-date")?.textContent;

      const coincideBusqueda = mensaje.includes(searchValue) || emisor.includes(searchValue) || curso.includes(searchValue);
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

// Exportar tabla a CSV
document.addEventListener('DOMContentLoaded', function () {
  const exportBtn = document.getElementById('exportarBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      exportTableToCSV('llamados.csv');
    });
  }
});

function exportTableToCSV(filename) {
  const table = document.querySelector('.calls-table table');
  let csv = [];
  for (let row of table.rows) {
    let rowData = [];
    for (let cell of row.cells) {
      // Elimina saltos de línea y comillas dobles
      let text = cell.innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, '""');
      rowData.push('"' + text + '"');
    }
    csv.push(rowData.join(','));
  }
  // Descarga el archivo
  let csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
  let downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Mostrar detalle del llamado en modal

document.addEventListener('DOMContentLoaded', function () {
  // Botón cerrar modal
  const cerrarBtn = document.getElementById('cerrarDetalleLlamado');
  if (cerrarBtn) {
    cerrarBtn.onclick = function () {
      document.getElementById('detalleLlamadoModal').style.display = 'none';
    };
  }

  // Botones de ojo en la tabla
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = btn.closest('tr');
      const detalle = {
        fecha: row.querySelector('.call-date')?.innerText || '',
        hora: row.querySelector('.call-time')?.innerText || '',
        curso: row.querySelector('.call-grade')?.innerText || '',
        emisor: row.querySelector('.emisor')?.innerText || '',
        mensaje: row.querySelector('.call-message')?.innerText || '',
        estado: row.querySelector('.status-badge')?.innerText || '',
        estadoClass: row.querySelector('.status-badge')?.className || '',
        prioridad: row.querySelector('.priority-badge')?.innerText || '',
        prioridadClass: row.querySelector('.priority-badge')?.className || '',
        preceptor: row.cells[6]?.innerText || '',
        tiempoRespuesta: row.cells[7]?.innerText || '-',
      };
      // Badge de estado
      let estadoBadge = `<span class="status-badge ${detalle.estadoClass.replace('status-badge', '').trim()}" style="font-size:13px;">${detalle.estado}</span>`;
      // Badge de prioridad
      let prioridadBadge = `<span class="priority-badge ${detalle.prioridadClass.replace('priority-badge', '').trim()}" style="font-size:13px;">${detalle.prioridad}</span>`;
      document.getElementById('detalleLlamadoContenido').innerHTML = `
        <div>
          <div class="detalle-llamado-titulo">Detalle del Llamado #1</div>
          <div class="detalle-llamado-subtitulo">Información completa del llamado</div>
          <div class="detalle-llamado-flex">
            <div class="detalle-llamado-col">
              <div class="detalle-llamado-col-titulo">Información General</div>
              <div><b>Fecha:</b> ${detalle.fecha}</div>
              <div><b>Hora:</b> ${detalle.hora}</div>
              <div><b>Curso:</b> ${detalle.curso}</div> 
              <div><b>Emisor:</b> ${detalle.emisor}</div>
            </div>
            <div class="detalle-llamado-col">
              <div class="detalle-llamado-col-titulo">Estado y Respuesta</div>
              <div><b>Estado:</b> ${estadoBadge}</div>
              <div><b>Prioridad:</b> ${prioridadBadge}</div>
              <div><b>Preceptor:</b> ${detalle.preceptor}</div>
            </div>
          </div>
        </div>
        <hr class="detalle-llamado-hr">
        <div class="detalle-llamado-label">Mensaje Original</div>
        <div class="detalle-llamado-mensaje">${detalle.mensaje}</div>
      `;
      document.getElementById('detalleLlamadoModal').style.display = 'flex';
      // Si tienes nivel y turno en los datos, puedes reemplazar los spans por los valores reales
    });
  });
});