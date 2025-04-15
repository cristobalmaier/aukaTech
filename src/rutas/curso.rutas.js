import { Router } from 'express'
const cursoRutas = new Router()

// Modelo para obtener datos
import CursoServicio from "../servicios/curso.servicios.js"

// Controlador
import CursoControlador from "../controladores/curso.controlador.js"
const cursoControlador = new CursoControlador({ cursoServicio: CursoServicio })

cursoRutas.get("/", cursoControlador.obtenerTodos)
cursoRutas.get("/:id", cursoControlador.obtenerCursoPorId)
cursoRutas.get("/nombre/:nombre", cursoControlador.obtenerCursoPorNombre)
cursoRutas.post("/crear", cursoControlador.crearCurso)
cursoRutas.put("/actualizar/:id", cursoControlador.actualizarCurso)
cursoRutas.delete("/eliminar/:id", cursoControlador.eliminarCurso)

export default cursoRutas