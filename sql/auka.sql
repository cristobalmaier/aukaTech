-- phpMyAdmin SQL Dump
-- Base de datos: `auka`
-- Servidor: 127.0.0.1
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` int(11) NOT NULL,
  `area` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `areas` (`id_area`, `area`) VALUES
(1, 'Recursos Humanos'),
(2, 'Tecnología'),
(3, 'Ventas'),
(4, 'Marketing'),
(5, 'Finanzas'),
(6, 'Operaciones'),
(7, 'Calidad'),
(8, 'Legal'),
(9, 'Compras'),
(10, 'Atención al Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prioridades`
--

CREATE TABLE `prioridades` (
  `numero_prioridad` int(11) NOT NULL,
  `nombre_prioridad` varchar(32) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prioridades` (`numero_prioridad`, `nombre_prioridad`, `descripcion`) VALUES
(1, 'Baja', 'Situaciones menores sin urgencia. Ejemplo: consulta interna, aviso leve.'),
(2, 'Media', 'Requiere atención pronto. Ejemplo: fallo técnico, conflicto entre áreas.'),
(3, 'Alta', 'Requiere acción inmediata. Ejemplo: emergencia, seguridad, pérdida de datos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` int(11) NOT NULL,
  `id_soporte` int(11) DEFAULT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `numero_prioridad` int(11) NOT NULL DEFAULT 1,
  `mensaje` varchar(300) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `finalizado` tinyint(1) NOT NULL DEFAULT 0,
  `cancelado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_solicitudes`
--

CREATE TABLE `respuestas_solicitudes` (
  `id_respuesta` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `id_soporte` int(11) NOT NULL,
  `fecha_respuesta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `nombre_turno` enum('mañana','tarde','vespertino') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_final` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `turnos` (`id_turno`, `nombre_turno`, `hora_inicio`, `hora_final`) VALUES
(1, 'mañana', '07:35:00', '11:55:00'),
(2, 'tarde', '12:55:00', '17:15:00'),
(3, 'vespertino', '17:35:00', '21:45:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_asignaciones`
--

CREATE TABLE `turnos_asignaciones` (
  `id_asignacion` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `id_soporte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `turnos_asignaciones` (`id_asignacion`, `id_turno`, `id_soporte`) VALUES
(3, 2, 8),
(4, 3, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `apellido` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo_usuario` enum('soporte','empleado','directivo','') DEFAULT 'empleado',
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`, `autorizado`) VALUES
(8, 'Alejandro Ariel', 'Manrique', 'alejandro@gmail.com', '$2b$05$j007.4grrUBOvurQc4tpBu86J6XjG09flrwfTA1xlwNUjewZx/Fjq', 'soporte', 1),
(9, 'Carlos Alberto', 'Robello', 'robello@gmail.com', '$2b$05$FHPuGgstOyFL6LLtP/829e./zEEx4agJNoRsh1YMIj6zxDh3GFaT.', 'empleado', 1),
(14, 'cristobal', 'maier', 'cristobalmaier1@gmail.com', '$2b$05$ggMTF3jCdBFBtPXUvhEvL.8bqAdA5gQtseg0RC/PDHxqNRmRt9hou', 'empleado', 1),
(15, 'alejandra', 'fernandez', 'alejandrafernandez@gmail.com', '$2b$05$sBA1337.YQVeSDOO87RKSea9b4Hrw3yaTnC17JS6HMP.yokGrIw8y', 'empleado', 1),
(16, 'tito', 'calderon', 'titocalderon@gmail.com', '$2b$05$OSNgcDq6AcdJbomkRN3V/OJZxwVDAoN90oTbQ9Ueq88oG4LlkV8ES', 'soporte', 1);

--
-- Índices para tablas volcadas
--

ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`);

ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_soporte` (`id_soporte`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_area` (`id_area`),
  ADD KEY `numero_prioridad` (`numero_prioridad`);

ALTER TABLE `prioridades`
  ADD PRIMARY KEY (`numero_prioridad`);

ALTER TABLE `respuestas_solicitudes`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id_soporte` (`id_soporte`);

ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`);

ALTER TABLE `turnos_asignaciones`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_soporte` (`id_soporte`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas
--

ALTER TABLE `areas`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

ALTER TABLE `respuestas_solicitudes`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `turnos_asignaciones`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas
--

ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`),
  ADD CONSTRAINT `solicitudes_ibfk_3` FOREIGN KEY (`numero_prioridad`) REFERENCES `prioridades` (`numero_prioridad`),
  ADD CONSTRAINT `solicitudes_ibfk_4` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `respuestas_solicitudes`
  ADD CONSTRAINT `respuestas_solicitudes_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`),
  ADD CONSTRAINT `respuestas_solicitudes_ibfk_2` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `turnos_asignaciones`
  ADD CONSTRAINT `turnos_asignaciones_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`),
  ADD CONSTRAINT `turnos_asignaciones_ibfk_2` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

COMMIT;