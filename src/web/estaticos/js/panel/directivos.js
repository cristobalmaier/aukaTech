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
