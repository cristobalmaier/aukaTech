import { Router } from 'express'
const turnosRutas = new Router()

// Servicio
import TurnoServicio from '../servicios/turno.servicios.js'

// Controlador
import TurnoControlador from '../controladores/turno.controlador.js'
const turnoControlador = new TurnoControlador({ turnoServicio: TurnoServicio })

turnosRutas.get("/", turnoControlador.obtenerTurnos)
turnosRutas.get("/:id", turnoControlador.obtenerTurnoPorId) 
turnosRutas.get('/usuario/:id', turnoControlador.obtenerTurnoPorUsuario)
turnosRutas.get('/hora/:hora', turnoControlador.obtenerTurnoPorHora)

turnosRutas.post("/crear", turnoControlador.crearTurno)
// turnosRutas.put("/editar", turnoControlador.actualizarTurno)
turnosRutas.delete("/eliminar", turnoControlador.eliminarTurno)
turnosRutas.post('/asignar', turnoControlador.asignarTurno)
turnosRutas.post('/desasignar', turnoControlador.desasignarTurno)

export default turnosRutas