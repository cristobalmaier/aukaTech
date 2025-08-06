import { Router } from 'express';
const panelRutas = new Router();

const API_URL = process.env.API_URL;

import { config } from '../../web/config.js';
import { peticion } from '../utiles/peticion.js';
import { tiempo } from '../utiles/tiempo.js';
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js';
import { esempleado, essoporte, estaLogeado } from '../utiles/auth.js';

// Función para formatear fechas
const formatoHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

// PANEL EMPLEADO
panelRutas.get('/panel/empleado', [estaLogeado, esempleado], async (req, res) => {
    const usuario = obtenerDatosToken(req);
    const hora_actual = tiempo({ fecha: new Date() });

    try {
        const [solicitudesRes, turnosRes, areasRes] = await Promise.all([
            peticion({
                url: `${API_URL}/solicitudes`,
                metodo: 'GET',
                query: { id_emisor: usuario.id_usuario, incluirDatosUsuario: true }
            }),
            peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' }),
            peticion({ url: `${API_URL}/areas`, metodo: 'GET' })
        ]);

        let solicitud = await solicitudesRes.json();
        let turnos = await turnosRes.json();
        let areas = await areasRes.json();

        // Normalización de datos
        if (!Array.isArray(solicitud)) {
            solicitud = [];
        } else {
            solicitud = solicitud.map(sol => ({
                ...sol,
                nombre: sol.nombre || sol.nombre_usuario || '',
                apellido: sol.apellido || sol.apellido_usuario || '',
                finalizado: sol.finalizado || 0,
                cancelado: sol.cancelado || 0,
                fecha_envio: sol.fecha_envio || new Date().toISOString()
            }));
        }

        if (!Array.isArray(turnos)) turnos = [];
        if (!Array.isArray(areas)) areas = [];

        // Buscar si hay una solicitud activa (no finalizada ni cancelada)
        const solicitudActiva = solicitud.find(s => s.finalizado == 0 && s.cancelado == 0);

        // Buscar respuesta si existe
        let respuesta = null;
        if (solicitudActiva) {
            const respuestaRes = await peticion({
                url: `${API_URL}/respuestas_solicitudes`,
                metodo: 'GET',
                query: { id_solicitud: solicitudActiva.id_solicitud }
            });

            const respuestas = await respuestaRes.json();
            if (Array.isArray(respuestas) && respuestas.length > 0) {
                respuesta = respuestas[0]; // Tomamos la más reciente
            }
        }

        res.render('paneles/empleado', {
            titulo: 'AUKA - Panel Empleado',
            usuario,
            solicitud: solicitudActiva ? {
                data: solicitudActiva,
                respuesta,
                areas
            } : undefined,
            turnos,
            formatoHora
        });

    } catch (error) {
        console.error('Error en panel empleado:', error);
        res.render('paneles/empleado', {
            titulo: 'AUKA - Panel Empleado',
            usuario,
            solicitud: undefined,
            turnos: [],
            areas: [],
            formatoHora
        });
    }
});

// PANEL SOPORTE
panelRutas.get('/panel/soporte', [estaLogeado, essoporte], async (req, res) => {
    const hora_actual = tiempo({ fecha: new Date() });
    const usuario = obtenerDatosToken(req);

    try {
        const [solicitudesRes, turnosRes] = await Promise.all([
            peticion({
                url: `${API_URL}/solicitudes`,
                metodo: 'GET',
                query: { incluirDatosUsuario: true }
            }),
            peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
        ]);

        let solicitudes = await solicitudesRes.json();
        if (!Array.isArray(solicitudes)) {
            solicitudes = [];
        } else {
            solicitudes = solicitudes.map(sol => ({
                ...sol,
                nombre: sol.nombre || sol.nombre_usuario || '',
                apellido: sol.apellido || sol.apellido_usuario || '',
                finalizado: sol.finalizado || 0,
                cancelado: sol.cancelado || 0,
                fecha_envio: sol.fecha_envio || new Date().toISOString()
            }));
        }

        const turnos = await turnosRes.json();

        res.render('paneles/soporte', {
            titulo: 'AUKA - Panel Soporte',
            usuario,
            solicitud: solicitudes,
            turnos,
            formatoHora
        });

    } catch (error) {
        console.error('Error en panel soporte:', error);
        res.render('paneles/soporte', {
            titulo: 'AUKA - Panel Soporte',
            usuario,
            solicitud: [],
            turnos: []
        });
    }
});

export default panelRutas;