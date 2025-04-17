const TIEMPO_ALERTA = 5000;

export function alerta({ mensaje, tipo }) {
    const alerta = document.createElement('div');
    alerta.classList.add('animate__animated', 'animate__fadeInDown', 'animate__faster');
    alerta.classList.add('alerta', 'alerta-' + tipo);

    if(tipo == 'exito') {
        alerta.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${mensaje}</span>`;
    }

    if(tipo == 'error') {
        alerta.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>${mensaje}</span>`;
    }

    if(tipo == 'info') {
        alerta.innerHTML = `<i class="fa-solid fa-info-circle"></i> <span>${mensaje}</span>`;
    }

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.classList.add('animate__fadeOutUp');
        setTimeout(() => {
            alerta.remove();
        }, 1000);
    }, TIEMPO_ALERTA);
}