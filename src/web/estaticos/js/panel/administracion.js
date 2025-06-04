document.addEventListener("DOMContentLoaded", () => {
    const userActionButtons = document.querySelectorAll('.user-action-button');
    const notificacion = document.getElementById('notificacion');
    const notificacionIcono = document.getElementById('notificacionIcono');
    const notificacionMensaje = document.getElementById('notificacionMensaje');

    function mostrarNotificacion(tipo, mensaje) {
        notificacion.classList.remove('alerta-exito', 'alerta-error');
        notificacionIcono.className = ''; // Clear existing classes

        if (tipo === 'exito') {
            notificacion.classList.add('alerta-exito');
            notificacionIcono.classList.add('fas', 'fa-check-circle');
        } else if (tipo === 'error') {
            notificacion.classList.add('alerta-error');
            notificacionIcono.classList.add('fas', 'fa-times-circle');
        }

        notificacionMensaje.textContent = mensaje;
        notificacion.style.display = 'flex';

        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000); // Ocultar después de 3 segundos
    }

    userActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentUserStatus = this.dataset.userStatus;
            const userEmail = this.dataset.userEmail; 
            let newStatus;
            let iconClass;
            let notificationMessage;
            let notificationType;
            // Store original states to revert on error
            const originalIconClass = this.querySelector('i').className;
            const statusBadge = this.closest('tr').querySelector('.status-badge');
            const originalStatusBadgeText = statusBadge ? statusBadge.textContent : '';
            const originalStatusBadgeClass = statusBadge ? statusBadge.className : '';

            if (currentUserStatus === 'activo') {
                newStatus = 'inactivo';
                iconClass = 'fas fa-user-slash';
                notificationMessage = 'Usuario desautorizado con éxito.';
                notificationType = 'exito';
            } else {
                newStatus = 'activo';
                iconClass = 'fas fa-user-check';
                notificationMessage = 'Usuario autorizado con éxito.';
                notificationType = 'exito';
            }

            // Immediate UI update for responsiveness
            this.dataset.userStatus = newStatus;
            this.querySelector('i').className = iconClass;
            if (statusBadge) {
                statusBadge.textContent = newStatus === 'activo' ? 'Activo' : 'Inactivo';
                statusBadge.classList.remove('status-activo', 'status-inactivo');
                statusBadge.classList.add(`status-${newStatus}`);
            }

            // Simulate API call
            new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    const success = true; // Always succeed
                    if (success) {
                        resolve({ status: 'success', message: notificationMessage });
                    } else {
                        reject({ status: 'error', message: 'Error al actualizar el usuario. Intente nuevamente.' });
                    }
                }, 500); // Simulate 0.5 second network delay
            })
            .then(response => {
                mostrarNotificacion(notificationType, response.message);
            })
            .catch(error => {
                // Revert UI changes on error
                this.dataset.userStatus = currentUserStatus;
                this.querySelector('i').className = originalIconClass;
                if (statusBadge) {
                    statusBadge.textContent = originalStatusBadgeText;
                    statusBadge.className = originalStatusBadgeClass; // Revert to original classes
                }
                mostrarNotificacion('error', error.message);
            });
        });
    });
});

// Función para mostrar notificación
function mostrarNotificacion(tipo, mensaje) {
    const notificacion = document.getElementById('notificacion');
    const notificacionIcono = document.getElementById('notificacionIcono');
    const notificacionMensaje = document.getElementById('notificacionMensaje');
  
    if (!notificacion || !notificacionIcono || !notificacionMensaje) return;
    
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

// Función para exportar la tabla de usuarios a CSV
function exportarUsuariosACSV() {
    try {
        const tabla = document.querySelector('.users-table table');
        if (!tabla) {
            throw new Error('No se encontró la tabla de usuarios');
        }

        // Obtener filas de la tabla
        const filas = tabla.querySelectorAll('tbody tr');
        if (filas.length === 0) {
            throw new Error('No hay datos de usuarios para exportar');
        }

        // Crear array para los datos CSV
        const csvData = [];
        
        // Agregar encabezados
        const headers = [];
        tabla.querySelectorAll('thead th').forEach(th => {
            // Excluir la columna de acciones
            if (th.textContent.trim() !== 'Acciones') {
                headers.push(`"${th.textContent.trim().replace(/"/g, '""')}"`);
            }
        });
        csvData.push(headers.join(','));

        // Procesar cada fila de datos
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const filaDatos = [];
            
            // Recorrer celdas (excluyendo la última columna de acciones)
            for (let i = 0; i < celdas.length - 1; i++) {
                let contenido = '';
                
                // Manejar celdas con badges de estado
                const badge = celdas[i].querySelector('.status-badge');
                if (badge) {
                    contenido = badge.textContent.trim();
                } else {
                    contenido = celdas[i].textContent.trim();
                }
                
                // Escapar comillas y saltos de línea
                contenido = contenido.replace(/"/g, '""')
                                   .replace(/\r?\n|\r/g, ' ')
                                   .trim();
                
                filaDatos.push(`"${contenido}"`);
            }
            
            csvData.push(filaDatos.join(','));
        });

        // Crear y descargar archivo CSV
        const csvContent = csvData.join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        
        enlace.setAttribute('href', url);
        enlace.setAttribute('download', 'usuarios.csv');
        enlace.style.display = 'none';
        
        document.body.appendChild(enlace);
        enlace.click();
        
        // Limpiar
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error al exportar a CSV:', error);
        throw error;
    }
}

// Configurar el evento de clic para el botón de exportar a CSV
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botón de exportar a CSV
    const botonExportarCSV = document.getElementById('boton-exportar-csv');
    
    if (botonExportarCSV) {
        botonExportarCSV.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                exportarUsuariosACSV();
                mostrarNotificacion('exito', 'Los datos se han exportado correctamente a usuarios.csv');
            } catch (error) {
                console.error('Error al exportar:', error);
                mostrarNotificacion('error', 'Error al exportar los datos: ' + error.message);
            }
        });
    }

    // Configurar botón de guardar configuración
    const botonGuardarConfig = document.getElementById('guardarConfiguracion');
    if (botonGuardarConfig) {
        botonGuardarConfig.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                // Aquí iría la lógica para guardar la configuración
                // Por ahora, simulamos una operación exitosa
                const exito = guardarConfiguracion();
                
                if (exito) {
                    mostrarNotificacion('exito', 'La configuración se ha guardado correctamente');
                } else {
                    throw new Error('No se pudo guardar la configuración');
                }
            } catch (error) {
                console.error('Error al guardar la configuración:', error);
                mostrarNotificacion('error', 'Error al guardar la configuración: ' + (error.message || 'Error desconocido'));
            }
        });
    }
});

// Función para guardar la configuración (simulación)
function guardarConfiguracion() {
    // Aquí iría la lógica real para guardar la configuración
    // Por ahora, simulamos un guardado exitoso el 90% de las veces
    return Math.random() > 0.1;
}
  