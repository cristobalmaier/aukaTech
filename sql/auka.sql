SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `auka` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `auka`;

CREATE TABLE `cursos` (
  `id_curso` int(11) NOT NULL,
  `curso` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `cursos` (`id_curso`, `curso`) VALUES
(1, '1°1'),
(2, '1°2'),
(3, '1°3'),
(4, '1°4'),
(5, '1°5'),
(6, '2°1'),
(7, '2°2'),
(8, '2°3'),
(9, '2°4'),
(10, '2°5'),
(11, '3°1'),
(12, '3°2'),
(13, '3°3'),
(14, '3°4'),
(15, '4°1'),
(16, '4°2'),
(17, '4°3'),
(18, '4°4'),
(19, '5°1'),
(20, '5°2'),
(21, '5°3'),
(22, '6°1'),
(23, '6°2'),
(24, '6°3'),
(25, '7°1'),
(26, '7°2');

CREATE TABLE `llamados` (
  `id_llamado` int(11) NOT NULL,
  `id_preceptor` int(11) DEFAULT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `numero_nivel` int(11) NOT NULL,
  `mensaje` varchar(300) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `niveles` (
  `numero_nivel` int(11) NOT NULL,
  `nombre_nivel` varchar(32) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `niveles` (`numero_nivel`, `nombre_nivel`, `descripcion`) VALUES
(1, 'Llamado', 'Situaciones menores donde se requiere la presencia de un preceptor, pero no hay urgencia. Ejemplo: estudiante que necesita hablar con un preceptor, aviso por comportamiento leve, consulta general.'),
(2, 'Moderado', 'Situaciones que requieren intervención rápida, pero no son críticas. Ejemplo: alumno con mareo persistente, falta grave de disciplina, lesión leve como un raspón profundo.'),
(3, 'Urgente', 'Situaciones que pueden escalar y requieren atención inmediata. Ejemplo: pelea física sin lesiones graves, estudiante con crisis emocional fuerte, descompensación de un estudiante con una condición médica conocida.'),
(4, 'Grave', 'Situaciones de alto riesgo que requieren asistencia de profesionales o servicios de emergencia. Ejemplo: desmayo prolongado, convulsiones, heridas serias con sangrado considerable, agresión física con daño evidente.'),
(5, 'Critico', 'Situaciones extremas con riesgo de vida. Ejemplo: paro cardíaco, traumatismo severo, pérdida del conocimiento prolongada, fallecimiento.');

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `apellido` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo_usuario` enum('preceptor','profesor','directivo','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`) VALUES
(1, 'Alejandro', 'Del Caño', 'alejadro.cano@gmail.com', '$2a$10$p.ODN3lLj5E3KcMzykKTaezvv', 'preceptor'),
(2, 'Ezequiel', 'Torres', 'ezequiel.torres@gmail.com', '$2a$10$4NqshlvJ7W6Nu3eU.8SCU.xZrOPpad65CnG7bFgX0.gAvRwKnY/kq', 'directivo'),
(3, 'Carlos Alberto', 'Robello', 'carlos.robello@gmail.com', '$2a$10$1ZeU/sArc.2fUtZ.QCWs/ep3YZ6yO.9u6jEa9vpHmBPcGzqZo6HSS', 'profesor');


ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`);

ALTER TABLE `llamados`
  ADD PRIMARY KEY (`id_llamado`),
  ADD KEY `id_profesor` (`id_preceptor`,`id_emisor`,`id_curso`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `numero_nivel` (`numero_nivel`);

ALTER TABLE `niveles`
  ADD PRIMARY KEY (`numero_nivel`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);


ALTER TABLE `cursos`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

ALTER TABLE `llamados`
  MODIFY `id_llamado` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `llamados`
  ADD CONSTRAINT `llamados_ibfk_1` FOREIGN KEY (`id_preceptor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `llamados_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `llamados_ibfk_3` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  ADD CONSTRAINT `llamados_ibfk_4` FOREIGN KEY (`numero_nivel`) REFERENCES `niveles` (`numero_nivel`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
