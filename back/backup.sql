-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: regalos2
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `list_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `price` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `place` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `place_link` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `img_name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `items_list_id_foreign` (`list_id`),
  CONSTRAINT `items_list_id_foreign` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,2,'non','33.02','https://ondricka.com/corporis-dolores-velit-a.html','ducimus','http://wolf.com/','Vero adipisci explicabo ut nostrum cupiditate in ut.','https://via.placeholder.com/640x480.png/00ff88?text=suscipit',NULL,NULL),(2,6,'et','19.01','http://www.witting.biz/dolorum-ad-occaecati-ipsa-quod-dolore-quis','occaecati','http://www.heathcote.biz/','Unde temporibus officia ipsa assumenda iusto.','https://via.placeholder.com/640x480.png/0077ff?text=sequi',NULL,NULL),(3,2,'ut','42.15','http://www.purdy.com/repellat-sint-eius-accusantium-ipsa-occaecati-nostrum-labore','earum','http://www.smith.com/temporibus-ullam-enim-voluptas-dolorem-est-consequatur-dolore.html','Quod est ut est voluptas quo tenetur.','https://via.placeholder.com/640x480.png/00eeee?text=laudantium',NULL,NULL),(4,5,'voluptatibus','6.22','http://abshire.com/et-quisquam-ut-quo-velit-atque-corrupti-id-nihil.html','labore','http://lesch.biz/omnis-labore-natus-excepturi-enim','Ex consequatur molestias eos odio.','https://via.placeholder.com/640x480.png/00aa99?text=exercitationem',NULL,NULL),(5,1,'asperiores','1.75','http://www.morar.com/quibusdam-distinctio-perferendis-quam-aliquid-delectus-dolorum','omnis','http://www.corwin.com/perferendis-esse-quaerat-sit-itaque-doloremque-quam','At cum exercitationem aliquam enim.','https://via.placeholder.com/640x480.png/001166?text=consectetur',NULL,NULL),(6,7,'magnam','30.1','http://zulauf.com/','expedita','http://satterfield.biz/repellendus-est-commodi-doloremque-reprehenderit-qui-voluptates-dolore-vel','Veritatis dolorum laudantium praesentium cupiditate facere et delectus.','https://via.placeholder.com/640x480.png/0088dd?text=placeat',NULL,NULL),(7,4,'incidunt','83.98','http://www.heathcote.biz/velit-eius-dolorem-ducimus-repudiandae','vel','http://crona.com/doloribus-eius-molestiae-rerum-placeat-neque-ratione-voluptate','Totam eum consequatur explicabo quia fuga tempore.','https://via.placeholder.com/640x480.png/0000cc?text=repellat',NULL,NULL),(8,2,'ea','47.32','http://grady.info/tempora-aut-quis-maiores-voluptas.html','cumque','http://erdman.com/accusantium-ea-voluptas-aliquam.html','Voluptates facilis quo quam ea.','https://via.placeholder.com/640x480.png/0088dd?text=molestias',NULL,NULL),(9,1,'soluta','25.57','http://reinger.com/voluptatibus-pariatur-dolores-temporibus-quia','sunt','http://www.haley.com/earum-ipsa-sint-unde-excepturi-voluptatem.html','Voluptatem et vitae voluptates.','https://via.placeholder.com/640x480.png/003366?text=et',NULL,NULL),(10,1,'commodi','83.47','https://prohaska.net/quia-nisi-veritatis-harum-ea-ut-sed-mollitia.html','inventore','https://www.flatley.com/id-aut-dolore-ipsum-optio-quo-amet-sed','Consequatur minus nam et nihil.','https://via.placeholder.com/640x480.png/007700?text=earum',NULL,NULL),(11,4,'voluptatem','86.87','http://keeling.org/blanditiis-repellendus-fuga-molestiae-corrupti-qui-totam.html','rerum','http://bernhard.net/aliquam-corrupti-voluptas-placeat','Velit repellendus est quia sit.','https://via.placeholder.com/640x480.png/000099?text=alias',NULL,NULL),(12,3,'animi','5.2','http://cole.info/aut-quia-sint-et-iusto-officia-doloremque','nemo','http://reilly.info/voluptas-laudantium-enim-qui-alias-molestiae-officiis.html','Quos odio qui voluptates architecto vel eligendi.','https://via.placeholder.com/640x480.png/005511?text=ducimus',NULL,NULL),(13,3,'molestias','91','https://deckow.com/beatae-natus-rerum-suscipit-et-debitis-dolores.html','mollitia','http://www.feest.com/est-aut-consectetur-nostrum-sunt-quos-voluptas-sunt-fugiat','Earum aliquid rem distinctio accusantium voluptatum voluptatem est voluptates.','https://via.placeholder.com/640x480.png/0022cc?text=ut',NULL,NULL),(14,3,'autem','92.22','http://hyatt.com/','omnis','http://www.terry.com/','Sit error laboriosam sed blanditiis quidem fugit nobis.','https://via.placeholder.com/640x480.png/00ffbb?text=eaque',NULL,NULL),(15,7,'rerum','35.56','https://www.pfeffer.com/perferendis-est-eius-et-et-quae-deserunt-quidem','sequi','http://www.nitzsche.biz/aspernatur-deleniti-at-consequuntur-enim-quas-et','Omnis inventore dolor velit et.','https://via.placeholder.com/640x480.png/007744?text=sed',NULL,NULL),(16,1,'fugiat','3.8','http://www.jacobson.com/labore-rerum-quisquam-tempore-est-eos','laudantium','https://www.barrows.info/aut-distinctio-dolorum-numquam-voluptatem-explicabo-aut','Ea sint nihil suscipit ad tenetur error.','https://via.placeholder.com/640x480.png/00dd99?text=iste',NULL,NULL),(17,7,'eligendi','44.4','http://collins.info/aliquid-modi-totam-veniam-nisi-vel-quae','est','http://www.pfeffer.com/impedit-vero-et-odio-quasi','Facilis et atque tempore enim.','https://via.placeholder.com/640x480.png/0022bb?text=commodi',NULL,NULL),(18,1,'culpa','35.86','http://heidenreich.net/','ut','http://jerde.org/expedita-exercitationem-perspiciatis-iste-quasi','Et qui voluptatem mollitia labore voluptas.','https://via.placeholder.com/640x480.png/003377?text=architecto',NULL,NULL),(19,6,'ut','93.14','http://www.paucek.biz/','ab','http://hirthe.com/cum-tempore-eius-non-voluptatem-id-dolorum','Amet consequatur deserunt sunt aut error vero.','https://via.placeholder.com/640x480.png/0055aa?text=autem',NULL,NULL),(20,7,'dolorum','23.53','http://yundt.info/libero-harum-consequatur-autem-et-dolores','placeat','http://bailey.com/omnis-possimus-eos-numquam','Ducimus doloribus labore molestias eos qui a.','https://via.placeholder.com/640x480.png/00aadd?text=et',NULL,NULL),(21,1,'iste','84.11','http://www.jones.biz/ea-nobis-voluptas-optio-vitae','quas','https://www.conroy.com/accusantium-occaecati-magni-saepe-quas-totam-et','Enim dolores voluptates occaecati non et quo voluptate rerum.','https://via.placeholder.com/640x480.png/00eedd?text=neque',NULL,NULL),(22,2,'aliquam','10.02','http://www.leuschke.com/voluptatem-ut-atque-alias-porro','dolorem','http://schowalter.com/','Sunt eius aut occaecati unde quo debitis cumque enim.','https://via.placeholder.com/640x480.png/006655?text=unde',NULL,NULL),(23,1,'in','62.52','http://jacobson.com/recusandae-debitis-non-corporis','ut','http://www.aufderhar.net/tempora-quo-illo-a-officiis-consequatur','Mollitia quis fugit eum aliquam rerum ea aut.','https://via.placeholder.com/640x480.png/00aacc?text=accusantium',NULL,NULL),(24,8,'atque','18.18','http://goodwin.com/facere-quibusdam-praesentium-consequuntur','placeat','http://www.gibson.biz/error-in-molestias-autem-blanditiis-voluptas-eius-non','Rerum ut sed minima necessitatibus aut ut corrupti.','https://via.placeholder.com/640x480.png/006666?text=recusandae',NULL,NULL),(25,2,'sint','40.17','http://www.luettgen.com/qui-natus-qui-reiciendis-animi-consequuntur','dicta','http://www.rath.biz/iste-culpa-quae-deserunt-repellat-qui.html','Alias facere aut assumenda omnis molestiae velit illum.','https://via.placeholder.com/640x480.png/000044?text=itaque',NULL,NULL);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci,
  `status` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'active',
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `due_date` date DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `color1` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '#000000',
  `color2` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '#000000',
  `categorys` tinyint(1) NOT NULL DEFAULT '0',
  `icon` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lists_user_id_foreign` (`user_id`),
  CONSTRAINT `lists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (1,'aliquam',2,'Exercitationem qui omnis nemo dolorem et omnis.','inactive',0,'2025-10-21','https://picsum.photos/640/480','#b81518','#6f6ca4',0,'enim',NULL,NULL),(2,'eius',2,'Aut est id dolorem voluptas ad animi.','active',1,'2025-06-13','https://picsum.photos/640/480','#db0244','#2fbd5d',1,'velit',NULL,NULL),(3,'rem',2,'Et nesciunt eum explicabo quidem sit sint.','inactive',1,'2025-08-30','https://picsum.photos/640/480','#43bff2','#9c14d2',0,'suscipit',NULL,NULL),(4,'aspernatur',1,'Voluptatum repellat rerum sit.','inactive',1,'2025-11-15','https://picsum.photos/640/480','#488b49','#12efa7',0,'quidem',NULL,NULL),(5,'consequatur',2,'Ullam nisi totam eius laborum nihil sint architecto.','inactive',1,'2026-01-20','https://picsum.photos/640/480','#1a4af4','#397f14',0,'et',NULL,NULL),(6,'voluptas',2,'Aut saepe eos soluta occaecati.','active',0,'2026-02-09','https://picsum.photos/640/480','#e33764','#5d2885',1,'omnis',NULL,NULL),(7,'asperiores',1,'Vitae ut rerum ipsum quas et optio.','active',1,'2026-02-14','https://picsum.photos/640/480','#f20993','#57ece0',1,'explicabo',NULL,NULL),(8,'labore',2,'Laudantium esse laudantium veniam quo.','active',0,'2025-06-04','https://picsum.photos/640/480','#8d53bb','#264de2',1,'vel',NULL,NULL);
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin',NULL,NULL),(2,'User',NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `role_id` bigint unsigned NOT NULL DEFAULT '2',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Benjamin Tavarez','benjamin000','$2y$10$6J0/MJt0SHsUaXC9LRMbgOAwfw/TiGWlQBsY7ezesRXYiTm0QbxoS',1,1,NULL,NULL),(2,'Mateo Effertz','cormier.talia','$2y$10$EBUPjwWp3X6VDqRXS8G.Rud5UPIObu6Q.wATkSIGeIWNZY715/oqK',1,2,NULL,NULL),(3,'Kristoffer Halvorson','jessika51','$2y$10$FZT1QJvc/061csUs.Z.TfeW55B4pd6rtPjjh3V2s569BMtXSMMwXy',1,2,NULL,NULL),(4,'Genevieve Altenwerth','denesik.odie','$2y$10$EG9Or3r1uG0JkkCoNQ63o.gkfkk772cXoZW/pfbD18BzIlxlwFRI.',1,2,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 23:14:14
