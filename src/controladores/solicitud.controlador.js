import ErrorCliente from "../utiles/error.js";

export default class SolicitudControlador {
    constructor({ solicitudervicio }) {
        this.solicitudervicio = solicitudervicio;
    }

    // ✅ Nuevo método para renderizar la vista soporte.ejs
    renderizarSoporte = async (req, res, next) => {
        try {
            const solicitud = await this.solicitudervicio.obtenerTodos({});
            const turnos = []; // Si tienes lógica para turnos, agrégala aquí

            res.render('paneles/soporte', {
                solicitud: Array.isArray(solicitud) ? solicitud : [],
                turnos,
                usuario: req.user || {},
                formatoHora: (fecha) => new Date(fecha).toLocaleTimeString('es-AR'),
                formato: (fecha) => new Date(fecha).toLocaleDateString('es-AR')
            });
        } catch (err) {
            next(new ErrorCliente('Error al cargar la vista de soporte', 500));
        }
    };

    // RESTO DE MÉTODOS SIN CAMBIOS (devuelven JSON)
    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await this.solicitudervicio.obtenerTodos(req.query);
            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    };

    obtenersolicitudPorId = async (req, res, next) => {
        try {
            const resultado = await this.solicitudervicio.obtenersolicitudPorId(req.params);
            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    };

    crearsolicitud = async (req, res, next) => {
        try {
            const resultado = await this.solicitudervicio.crearsolicitud(req.body);
            res.status(201).json({
                mensaje: 'Solicitud creada',
                data: { id: resultado.insertId }
            });
        } catch (err) {
            next(err);
        }
    };

    eliminarsolicitud = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.solicitudervicio.eliminarsolicitud({ id });
            res.status(200).json({ mensaje: 'Solicitud eliminada' });
        } catch (err) {
            next(err);
        }
    };

    actualizarsolicitud = async (req, res, next) => {
        try {
            const resultado = await this.solicitudervicio.actualizarsolicitud({
                id: req.params.id,
                ...req.body
            });
            res.status(200).json({ mensaje: 'Solicitud actualizada', data: resultado });
        } catch (err) {
            next(err);
        }
    };
}