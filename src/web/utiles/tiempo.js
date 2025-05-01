export const tiempo = ({ fecha }) => {
    const hora = new Date(fecha).getHours()
    const minutos = new Date(fecha).getMinutes()
    const segundos = new Date(fecha).getSeconds()

    return `${hora}:${minutos}:${segundos}`
}