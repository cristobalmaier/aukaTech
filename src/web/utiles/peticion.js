export async function peticion({ url, metodo, cuerpo }) {
    const respuesta = await fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cuerpo)
    })

    return respuesta
}