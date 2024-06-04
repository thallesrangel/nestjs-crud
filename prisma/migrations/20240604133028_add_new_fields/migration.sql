-- AddForeignKey
ALTER TABLE `ServicePassword` ADD CONSTRAINT `ServicePassword_id_place_fkey` FOREIGN KEY (`id_place`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
