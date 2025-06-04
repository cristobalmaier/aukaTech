import { Router } from "express";
const datosRutas = new Router()

import DatosServicios from "../servicios/datos.servicios.js";

import DatosControlador from "../controladores/datos.controlador.js";
const datosControlador = new DatosControlador({ datosServicio: new DatosServicios() })

datosRutas.get('/size/database', datosControlador.tablasTamano)

export default datosRutas