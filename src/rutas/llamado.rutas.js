import { Router } from 'express'
const llamadoRutas = new Router()

// Modelo para obtener datos
import LlamadoServicio from "../servicios/llamado.servicios.js"

// Controlador
import LlamadoControlador from "../controladores/llamado.controlador.js"
const llamadoControlador = new LlamadoControlador({ llamadoServicio: LlamadoServicio })

llamadoRutas.get("/", llamadoControlador.obtenerTodos)
llamadoRutas.get("/:id", llamadoControlador.obtenerLlamadoPorId)
llamadoRutas.post("/crear", llamadoControlador.crearLlamado)
llamadoRutas.delete("/eliminar/:id", llamadoControlador.eliminarLlamado)
llamadoRutas.put("/actualizar/:id", llamadoControlador.actualizarLlamado)

export default llamadoRutas