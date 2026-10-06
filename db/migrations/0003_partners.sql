CREATE TABLE `partners` (
	`id` bigint unsigned AUTO_INCREMENT PRIMARY KEY,
	`loja` varchar(255) NOT NULL,
	`cidade` varchar(120) NOT NULL,
	`uf` char(2) NOT NULL,
	`whatsapp` varchar(30) NOT NULL,
	`beneficio` varchar(255) NOT NULL,
	`atendimentoAdaptado` boolean NOT NULL DEFAULT false,
	`lgpdConsent` boolean NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
CREATE INDEX `partners_uf_idx` ON `partners` (`uf`);
CREATE INDEX `partners_status_idx` ON `partners` (`status`);
