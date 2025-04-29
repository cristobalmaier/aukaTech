export const formato = ({ div }) => {
    const spanFechaEnvio = div.querySelector('.fecha-envio')

    timeago.render(spanFechaEnvio)
}