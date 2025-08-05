import { Router } from 'express'
const solicitudRutas = new Router()

import solicitudervicio from "../servicios/solicitud.servicios.js"
import SolicitudControlador from "../controladores/solicitud.controlador.js"

const controladorSolicitud = new SolicitudControlador({
    solicitudervicio: new solicitudervicio()
})

solicitudRutas.get("/", controladorSolicitud.obtenerTodos)
solicitudRutas.get("/:id", controladorSolicitud.obtenersolicitudPorId)
solicitudRutas.post("/crear", controladorSolicitud.crearsolicitud)
solicitudRutas.delete("/eliminar/:id", controladorSolicitud.eliminarsolicitud)
solicitudRutas.put("/actualizar/:id", controladorSolicitud.actualizarsolicitud)

export default solicitudRutas