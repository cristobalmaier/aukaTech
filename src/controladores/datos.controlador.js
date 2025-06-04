class DatosControlador {
    constructor({ datosServicio }) {
        this.datosServicio = datosServicio
    }

    tablasTamano = async (req, res, next) => {
        try {
            const resultado = await this.datosServicio.tablasTamano()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default DatosControlador