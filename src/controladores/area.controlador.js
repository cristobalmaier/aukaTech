import AreaServicio from "../servicios/area.servicios.js";

class AreaControlador {
    constructor({ areaServicio }) {
        this.areaServicio = areaServicio;
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const areas = await this.areaServicio.obtenerTodos();
            res.status(200).json(areas);
        } catch (error) {
            next(error);
        }
    };

    obtenerAreaPorId = async (req, res, next) => {
        try {
            const area = await this.areaServicio.obtenerAreaPorId({ id: req.params.id });
            if (!area) return res.status(404).json({ mensaje: "Área no encontrada" });
            res.status(200).json(area);
        } catch (error) {
            next(error);
        }
    };

    crearArea = async (req, res, next) => {
        try {
            const nuevaArea = await this.areaServicio.crearArea({ nombre: req.body.nombre });
            res.status(201).json(nuevaArea);
        } catch (error) {
            next(error);
        }
    };

    actualizarArea = async (req, res, next) => {
        try {
            const areaActualizada = await this.areaServicio.actualizarArea({
                id: req.params.id,
                nombre: req.body.nombre
            });
            res.status(200).json(areaActualizada);
        } catch (error) {
            next(error);
        }
    };

    eliminarArea = async (req, res, next) => {
        try {
            await this.areaServicio.eliminarArea({ id: req.params.id });
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    };
}

export default AreaControlador;