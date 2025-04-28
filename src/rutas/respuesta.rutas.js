import { Router } from 'express'
const respuestaRutas = new Router()

// Modelo para obtener datos
import RespuestaServicio from "../servicios/respuesta.servicios.js"

// Controlador
import RespuestaControlador from "../controladores/respuesta.controlador.js"
const respuestaControlador = new RespuestaControlador({ respuestaServicio: RespuestaServicio })

respuestaRutas.get("/", respuestaControlador.obtenerRespuestas)
respuestaRutas.post("/crear", respuestaControlador.crearRespuesta)
respuestaRutas.delete("/eliminar/:respuestaId", respuestaControlador.eliminarRespuesta)
respuestaRutas.put("/actualizar/:respuestaId", respuestaControlador.actualizarRespuesta)

export default respuestaRutas