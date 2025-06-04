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