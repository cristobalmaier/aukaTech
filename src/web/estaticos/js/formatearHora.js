export const formatearHora = (datetime) => {
    const fecha = new Date(datetime);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    
    const horaFormateada = horas.toString().padStart(2, '0');
    
    return `${horaFormateada}:${minutos} ${ampm}`;
}