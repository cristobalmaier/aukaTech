class TurnoControlador {
    constructor({ turnoServicio }) {
        this.turnoServicio = turnoServicio
    }

    obtenerTurnos = async (req, res, next) => {
        try {
            const resultado = await this.turnoServicio.obtenerTurnos()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerTurnoPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.turnoServicio.obtenerTurnoPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
    
    // ! PUEDE SER ELIMINADO
    obtenerTurnoPorNombre = async (req, res, next) => {
        const { nombre } = req.params

        try {
            const resultado = await this.turnoServicio.obtenerTurnoPorNombre({ nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerTurnoPorUsuario = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.turnoServicio.obtenerTurnoPorUsuario({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerTurnoPorHora = async (req, res, next) => {
        const { hora } = req.params

        try {
            const resultado = await this.turnoServicio.obtenerTurnoPorHora({ hora })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearTurno = async (req, res, next) => {
        const { nombre, hora_inicio, hora_final } = req.body || {}

        try {
            const resultado = await this.turnoServicio.crearTurno({ nombre, hora_inicio, hora_final })
            res.status(200).json({ mensaje: 'turno creado', data: { id: resultado.insertId } }) 
        } catch(err) {
            next(err)
        }
    }

    eliminarTurno = async (req, res, next) => {
        const { id } = req.body

        try {
            const resultado = await this.turnoServicio.eliminarTurno({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    asignarTurno = async (req, res, next) => {
        const { id_usuario, id_turno } = req.body || {}

        try {
            const resultado = await this.turnoServicio.asignarTurno({ id_usuario, id_turno })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    desasignarTurno = async (req, res, next) => {
        const { id_usuario, id_turno } = req.body || {}

        try {
            const resultado = await this.turnoServicio.desasignarTurno({ id_usuario, id_turno })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default TurnoControlador