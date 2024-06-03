-- CreateTable
CREATE TABLE `ServicePasswordLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clinic` INTEGER NOT NULL,
    `id_service_password_group` INTEGER NOT NULL,
    `id_service_password` INTEGER NOT NULL,
    `id_patient` INTEGER NULL,
    `id_place` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `type` ENUM('normal', 'preferencial') NOT NULL,
    `deleted` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServicePasswordLog` ADD CONSTRAINT `ServicePasswordLog_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePasswordLog` ADD CONSTRAINT `ServicePasswordLog_id_service_password_group_fkey` FOREIGN KEY (`id_service_password_group`) REFERENCES `ServicePasswordGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePasswordLog` ADD CONSTRAINT `ServicePasswordLog_id_service_password_fkey` FOREIGN KEY (`id_service_password`) REFERENCES `ServicePassword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePasswordLog` ADD CONSTRAINT `ServicePasswordLog_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePasswordLog` ADD CONSTRAINT `ServicePasswordLog_id_place_fkey` FOREIGN KEY (`id_place`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
