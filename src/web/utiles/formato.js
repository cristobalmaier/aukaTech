import timeago from "timeago.js";

const traducciones = (numero, index) => {
    return [
        ['justo ahora', 'en un rato'],
        ['hace %s segundos', 'en %s segundos'],
        ['hace 1 minuto', 'en 1 minuto'],
        ['hace %s minutos', 'en %s minutos'],
        ['hace 1 hora', 'en 1 hora'],
        ['hace %s horas', 'en %s horas'],
        ['hace 1 día', 'en 1 día'],
        ['hace %s días', 'en %s días'],
        ['hace 1 semana', 'en 1 semana'],
        ['hace %s semanas', 'en %s semanas'],
        ['hace 1 mes', 'en 1 mes'],
        ['hace %s meses', 'en %s meses'],
        ['hace 1 año', 'en 1 año'],
        ['hace %s años', 'en %s años'],
    ][index];
}

timeago.register('es', traducciones);

export const formato = (fecha) => {
    return timeago.format(fecha, 'es')
}

export const formatoHora = (datetime) => {
    const fecha = new Date(datetime);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    
    const horaFormateada = horas.toString().padStart(2, '0');
    
    return `${horaFormateada}:${minutos} ${ampm}`;
}