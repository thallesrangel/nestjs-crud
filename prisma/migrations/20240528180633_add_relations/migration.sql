-- CreateTable
CREATE TABLE `Clinic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clinic` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NULL DEFAULT false,
    `role` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clinic` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `show_on_totem` BOOLEAN NULL DEFAULT false,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicePasswordGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clinic` INTEGER NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicePassword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_service_password_group` INTEGER NOT NULL,
    `id_clinic` INTEGER NOT NULL,
    `id_patient` INTEGER NULL,
    `id_place` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `type` ENUM('normal', 'preferencial') NOT NULL,
    `status` ENUM('aguardando', 'em_atendimento', 'atendida') NOT NULL,
    `deleted` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clinic` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Place` ADD CONSTRAINT `Place_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePasswordGroup` ADD CONSTRAINT `ServicePasswordGroup_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePassword` ADD CONSTRAINT `ServicePassword_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePassword` ADD CONSTRAINT `ServicePassword_id_service_password_group_fkey` FOREIGN KEY (`id_service_password_group`) REFERENCES `ServicePasswordGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePassword` ADD CONSTRAINT `ServicePassword_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_id_clinic_fkey` FOREIGN KEY (`id_clinic`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
