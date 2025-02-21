-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: smartrecipe
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_RecipeIngredients`
--

DROP TABLE IF EXISTS `_RecipeIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_RecipeIngredients` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_RecipeIngredients_AB_unique` (`A`,`B`),
  KEY `_RecipeIngredients_B_index` (`B`),
  CONSTRAINT `_RecipeIngredients_A_fkey` FOREIGN KEY (`A`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_RecipeIngredients_B_fkey` FOREIGN KEY (`B`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_RecipeIngredients`
--

LOCK TABLES `_RecipeIngredients` WRITE;
/*!40000 ALTER TABLE `_RecipeIngredients` DISABLE KEYS */;
/*!40000 ALTER TABLE `_RecipeIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_UserRecipes`
--

DROP TABLE IF EXISTS `_UserRecipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_UserRecipes` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_UserRecipes_AB_unique` (`A`,`B`),
  KEY `_UserRecipes_B_index` (`B`),
  CONSTRAINT `_UserRecipes_A_fkey` FOREIGN KEY (`A`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_UserRecipes_B_fkey` FOREIGN KEY (`B`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_UserRecipes`
--

LOCK TABLES `_UserRecipes` WRITE;
/*!40000 ALTER TABLE `_UserRecipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `_UserRecipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('12474b35-e273-43b6-804f-7bdb49acfca4','bfcb40919a6d8ad2dce0aaf5f00f24e84426fbcbc02b02a4d98c37a1e8d15dd0','2025-02-10 10:46:41.948','20241202145658_',NULL,NULL,'2025-02-10 10:46:40.274',1),('24939379-e3c7-4441-b816-1cf63b591501','1b22a46fd615c48c9d7dafeffb3949ff9d2d8f077cacdfc816dd8247ead82ab8','2025-02-10 10:46:40.264','20241202144143_changed_casings',NULL,NULL,'2025-02-10 10:46:37.628',1),('356293c9-790c-4a75-9471-4e0dfa8d9772','8e6d937e55de3e6f73b78c9a8b408e5f0e8dd4fa8f5152c3589a4781ce8a5115','2025-02-10 10:46:37.470','20241129131435_add_user_recipe_pivot',NULL,NULL,'2025-02-10 10:46:37.172',1),('6acdf106-e84b-4b3a-9bd2-e6d29acfef99','15ea0bbc3cda30f34181eaa00650f221abf5a17dda81783e7681688907583218','2025-02-10 10:46:42.302','20241217190210_update_user_model',NULL,NULL,'2025-02-10 10:46:42.169',1),('7edba442-e4e4-4185-b6a7-9d3b6dd1ac36','099231043cdb7a1a30fd848dc695ec28231a65100145454da9bdc9dd2f425c7e','2025-02-10 10:46:37.620','20241129132827_update_instruction_part_to_int',NULL,NULL,'2025-02-10 10:46:37.478',1),('c7abf98e-8404-43f7-8953-b709fc1e76fa','f6f0f5fe701245109d802af70dbb0a92553c72c15aa3bfc412f81f7563de59c1','2025-02-10 10:46:42.151','20241205200658_add_unique_to_ingredient_name_and_change_prep_and_cook_to_json',NULL,NULL,'2025-02-10 10:46:41.957',1),('f7542250-21e5-41ba-8536-d6731e23e991','f7ea51fb4f20e8cffece64ccf697b6139a5bb4fae79f73ee9b64483272150afe','2025-02-10 10:46:37.160','20241129130147_init',NULL,NULL,'2025-02-10 10:46:34.719',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiResponses`
--

DROP TABLE IF EXISTS `aiResponses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiResponses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userPromptId` int NOT NULL,
  `response` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aiResponses_userPromptId_key` (`userPromptId`),
  CONSTRAINT `aiResponses_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiResponses`
--

LOCK TABLES `aiResponses` WRITE;
/*!40000 ALTER TABLE `aiResponses` DISABLE KEYS */;
INSERT INTO `aiResponses` VALUES (7,7,'{\"data\": {\"name\": \"Tasty Concrete Towels\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 34}, \"prep\": {\"unit\": \"minutes\", \"value\": 20}, \"total\": {\"unit\": \"minutes\", \"value\": 16}}, \"portions\": 4, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Intelligent Granite Mouse\", \"unit\": \"tbsp\", \"value\": 469, \"comment\": \"Patruus aufero quasi terga abscido desparatus.\"}], \"finalComment\": \"Deripio cinis auditor solium tabella.\", \"instructions\": [{\"part\": \"Fantastic Wooden Keyboard\", \"steps\": [\"Spes cibus sono adduco architecto est aegre venia.\"]}]}}','2025-02-10 11:19:52.731','2025-02-10 11:19:52.731',NULL),(8,8,'{\"data\": {\"name\": \"Licensed Cotton Pizza\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 44}, \"prep\": {\"unit\": \"minutes\", \"value\": 11}, \"total\": {\"unit\": \"minutes\", \"value\": 54}}, \"portions\": 4, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Ergonomic Bamboo Fish\", \"unit\": \"ml\", \"value\": 131, \"comment\": \"Tabella angustus argumentum labore corrigo beatae alioqui quos utilis.\"}], \"finalComment\": \"Trans eligendi crustulum valde thema attero audeo.\", \"instructions\": [{\"part\": \"Tasty Steel Ball\", \"steps\": [\"Vulticulus demonstro cum confero compello.\"]}]}}','2025-02-10 11:19:52.731','2025-02-10 11:19:52.731',NULL),(9,9,'{\"data\": {\"name\": \"Elegant Granite Sausages\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 51}, \"prep\": {\"unit\": \"minutes\", \"value\": 13}, \"total\": {\"unit\": \"minutes\", \"value\": 39}}, \"portions\": 2, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Frozen Metal Shirt\", \"unit\": \"tsp\", \"value\": 217, \"comment\": \"Suggero deporto tenax adinventitias cupiditas defungo sufficio victoria appositus.\"}], \"finalComment\": \"Convoco avarus nostrum temeritas ab vitiosus voluntarius comminor ullus tunc.\", \"instructions\": [{\"part\": \"Awesome Wooden Chips\", \"steps\": [\"Tergiversatio summisse cui deserunt beneficium tabgo sponte appono.\"]}]}}','2025-02-10 11:19:52.731','2025-02-10 11:19:52.731',NULL),(10,10,'{\"data\": {\"name\": \"Luxurious Metal Tuna\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 50}, \"prep\": {\"unit\": \"minutes\", \"value\": 19}, \"total\": {\"unit\": \"minutes\", \"value\": 78}}, \"portions\": 3, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Incredible Marble Bacon\", \"unit\": \"tsp\", \"value\": 70, \"comment\": \"Admiratio alias uterque desino adflicto alioqui velum vorago.\"}], \"finalComment\": \"Magnam derelinquo tutis temporibus utpote.\", \"instructions\": [{\"part\": \"Sleek Granite Shoes\", \"steps\": [\"Caritas demitto adinventitias spero corona caste.\"]}]}}','2025-02-10 11:19:52.732','2025-02-10 11:19:52.732',NULL),(11,11,'{\"data\": {\"name\": \"Refined Marble Sausages\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 45}, \"prep\": {\"unit\": \"minutes\", \"value\": 20}, \"total\": {\"unit\": \"minutes\", \"value\": 79}}, \"portions\": 2, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Awesome Cotton Mouse\", \"unit\": \"ml\", \"value\": 296, \"comment\": \"Tolero vitium cavus amaritudo calco ambitus defessus voro vix.\"}], \"finalComment\": \"Solitudo quibusdam coepi theatrum.\", \"instructions\": [{\"part\": \"Recycled Ceramic Bacon\", \"steps\": [\"Ex sopor quibusdam antea asper virga.\"]}]}}','2025-02-10 11:19:52.732','2025-02-10 11:19:52.732',NULL),(12,12,'{\"data\": {\"name\": \"Licensed Plastic Computer\", \"time\": {\"cook\": {\"unit\": \"minutes\", \"value\": 39}, \"prep\": {\"unit\": \"minutes\", \"value\": 8}, \"total\": {\"unit\": \"minutes\", \"value\": 47}}, \"portions\": 3, \"recipeId\": 0, \"ingredients\": [{\"name\": \"Tasty Silk Sausages\", \"unit\": \"cups\", \"value\": 211, \"comment\": \"Sapiente illo dolore canonicus thalassinus tergeo calamitas solium.\"}], \"finalComment\": \"Adulescens cubitum sustineo bis universe celer.\", \"instructions\": [{\"part\": \"Unbranded Silk Mouse\", \"steps\": [\"Vigor carcer deficio defluo clamo provident stipes deprecator ceno crebro.\"]}]}}','2025-02-10 11:19:52.732','2025-02-10 11:19:52.732',NULL);
/*!40000 ALTER TABLE `aiResponses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ingredients_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (11,'Fantastic Bronze Keyboard','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(12,'Fantastic Aluminum Soap','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(13,'Unbranded Gold Bike','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(14,'Intelligent Rubber Cheese','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(15,'Handcrafted Silk Sausages','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(16,'Recycled Aluminum Chips','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(17,'Practical Ceramic Table','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(18,'Practical Ceramic Chicken','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(19,'Practical Rubber Car','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL),(20,'Ergonomic Wooden Pizza','2025-02-10 11:19:52.672','2025-02-10 11:19:52.672',NULL);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructions`
--

DROP TABLE IF EXISTS `instructions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipeId` int NOT NULL,
  `part` int NOT NULL,
  `steps` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `instructions_recipeId_fkey` (`recipeId`),
  CONSTRAINT `instructions_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructions`
--

LOCK TABLES `instructions` WRITE;
/*!40000 ALTER TABLE `instructions` DISABLE KEYS */;
INSERT INTO `instructions` VALUES (7,7,1,'{\"text\": \"Denego vindico alveus delectatio abstergo.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL),(8,8,2,'{\"text\": \"Demum spargo sumptus carmen sophismata amoveo laboriosam approbo colo.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL),(9,9,3,'{\"text\": \"Antepono arcesso totam.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL),(10,10,4,'{\"text\": \"Abbas incidunt dens vesper.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL),(11,11,5,'{\"text\": \"Suasoria paulatim eius.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL),(12,12,6,'{\"text\": \"Suppellex decumbo damno succedo.\"}','2025-02-10 11:19:52.792','2025-02-10 11:19:52.792',NULL);
/*!40000 ALTER TABLE `instructions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modificationResponses`
--

DROP TABLE IF EXISTS `modificationResponses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modificationResponses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aiResponseId` int NOT NULL,
  `modificationId` int NOT NULL,
  `appliedToRecipe` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modificationResponses_aiResponseId_fkey` (`aiResponseId`),
  KEY `modificationResponses_modificationId_fkey` (`modificationId`),
  CONSTRAINT `modificationResponses_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `modificationResponses_modificationId_fkey` FOREIGN KEY (`modificationId`) REFERENCES `recipeModifications` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modificationResponses`
--

LOCK TABLES `modificationResponses` WRITE;
/*!40000 ALTER TABLE `modificationResponses` DISABLE KEYS */;
INSERT INTO `modificationResponses` VALUES (7,7,7,1,'2025-02-10 11:19:52.878','2025-02-10 11:19:52.878',NULL),(8,8,8,1,'2025-02-10 11:19:52.878','2025-02-10 11:19:52.878',NULL),(9,9,9,1,'2025-02-10 11:19:52.879','2025-02-10 11:19:52.879',NULL),(10,10,10,1,'2025-02-10 11:19:52.879','2025-02-10 11:19:52.879',NULL),(11,11,11,1,'2025-02-10 11:19:52.879','2025-02-10 11:19:52.879',NULL),(12,12,12,1,'2025-02-10 11:19:52.879','2025-02-10 11:19:52.879',NULL);
/*!40000 ALTER TABLE `modificationResponses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipeIngredients`
--

DROP TABLE IF EXISTS `recipeIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipeIngredients` (
  `recipeId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `value` double NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`recipeId`,`ingredientId`),
  KEY `recipeIngredients_ingredientId_fkey` (`ingredientId`),
  CONSTRAINT `recipeIngredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `recipeIngredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipeIngredients`
--

LOCK TABLES `recipeIngredients` WRITE;
/*!40000 ALTER TABLE `recipeIngredients` DISABLE KEYS */;
INSERT INTO `recipeIngredients` VALUES (7,13,98,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(7,14,74,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(7,15,2,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(7,18,53,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(7,20,17,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(8,11,23,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(8,12,52,'grams',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(8,14,33,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(8,16,29,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(8,19,29,'grams',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(9,11,54,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(9,14,95,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(9,15,82,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(9,17,15,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(9,20,85,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(10,12,28,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(10,14,80,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(10,17,89,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(10,18,21,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(10,19,73,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(11,12,51,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(11,13,59,'cups',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(11,14,70,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(11,15,100,'grams',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(11,17,83,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(12,11,42,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(12,14,28,'ml',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(12,16,16,'grams',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(12,18,74,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL),(12,20,51,'pieces',NULL,'2025-02-10 11:19:52.816','2025-02-10 11:19:52.816',NULL);
/*!40000 ALTER TABLE `recipeIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipeModifications`
--

DROP TABLE IF EXISTS `recipeModifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipeModifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipeId` int NOT NULL,
  `userPromptId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recipeModifications_recipeId_fkey` (`recipeId`),
  KEY `recipeModifications_userPromptId_fkey` (`userPromptId`),
  CONSTRAINT `recipeModifications_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `recipeModifications_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipeModifications`
--

LOCK TABLES `recipeModifications` WRITE;
/*!40000 ALTER TABLE `recipeModifications` DISABLE KEYS */;
INSERT INTO `recipeModifications` VALUES (7,7,7,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL),(8,8,8,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL),(9,9,9,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL),(10,10,10,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL),(11,11,11,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL),(12,12,12,1,'2025-02-10 11:19:52.851','2025-02-10 11:19:52.851',NULL);
/*!40000 ALTER TABLE `recipeModifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `recipe_times`
--

DROP TABLE IF EXISTS `recipe_times`;
/*!50001 DROP VIEW IF EXISTS `recipe_times`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `recipe_times` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `total_recipe_time`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aiResponseId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `portionSize` int NOT NULL,
  `finalComment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `prep` json NOT NULL,
  `cook` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipes_aiResponseId_fkey` (`aiResponseId`),
  CONSTRAINT `recipes_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (7,7,'Frozen Silk Hat',6,'Adopto concido ciminatio quos alioqui auctus argentum dolores ipsum supra.','2025-02-10 11:19:52.764','2025-02-10 11:19:52.764',NULL,'{\"unit\": \"minutes\", \"value\": 13}','{\"unit\": \"minutes\", \"value\": 25}'),(8,8,'Recycled Ceramic Pants',8,'Incidunt vallum apostolus.','2025-02-10 11:19:52.764','2025-02-10 11:19:52.764',NULL,'{\"unit\": \"minutes\", \"value\": 11}','{\"unit\": \"minutes\", \"value\": 11}'),(9,9,'Modern Granite Bacon',7,'Crudelis cervus acidus abbas supellex decumbo tyrannus aperiam tollo.','2025-02-10 11:19:52.764','2025-02-10 11:19:52.764',NULL,'{\"unit\": \"minutes\", \"value\": 25}','{\"unit\": \"minutes\", \"value\": 8}'),(10,10,'Small Aluminum Cheese',7,'Talio cito asporto voveo tabernus subvenio avarus.','2025-02-10 11:19:52.764','2025-02-10 11:19:52.764',NULL,'{\"unit\": \"minutes\", \"value\": 29}','{\"unit\": \"minutes\", \"value\": 6}'),(11,11,'Frozen Marble Ball',6,'Accedo sum nesciunt textilis tum ullus illo stultus statua torrens.','2025-02-10 11:19:52.764','2025-02-10 11:19:52.764',NULL,'{\"unit\": \"minutes\", \"value\": 16}','{\"unit\": \"minutes\", \"value\": 6}'),(12,12,'Licensed Ceramic Computer',3,'Votum bestia cometes stipes contigo tantillus conservo.','2025-02-10 11:19:52.765','2025-02-10 11:19:52.765',NULL,'{\"unit\": \"minutes\", \"value\": 11}','{\"unit\": \"minutes\", \"value\": 9}');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_recipe_update` BEFORE UPDATE ON `recipes` FOR EACH ROW SET NEW.updatedAt = NOW() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `userPrompts`
--

DROP TABLE IF EXISTS `userPrompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userPrompts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `prompt` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `aiResponseId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userPrompts_userId_fkey` (`userId`),
  CONSTRAINT `userPrompts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userPrompts`
--

LOCK TABLES `userPrompts` WRITE;
/*!40000 ALTER TABLE `userPrompts` DISABLE KEYS */;
INSERT INTO `userPrompts` VALUES (7,7,'{\"data\": {\"comments\": \"Soleo vulpes tempore.\", \"cookingTime\": \"any\", \"ingredients\": [\"Bespoke Ceramic Chair\", \"Unbranded Marble Pizza\", \"Generic Rubber Soap\"], \"willingToShop\": true, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL),(8,8,'{\"data\": {\"comments\": \"Depopulo sursum accendo arx trucido.\", \"cookingTime\": \"short\", \"ingredients\": [\"Sleek Aluminum Sausages\", \"Frozen Steel Hat\", \"Sleek Wooden Chair\"], \"willingToShop\": true, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL),(9,9,'{\"data\": {\"comments\": \"Delectatio ambitus varietas ocer.\", \"cookingTime\": \"any\", \"ingredients\": [\"Tasty Marble Pizza\", \"Sleek Marble Tuna\", \"Awesome Metal Ball\"], \"willingToShop\": true, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL),(10,10,'{\"data\": {\"comments\": \"Demens torqueo creber inflammatio decet comburo spiculum velit tutamen vestigium.\", \"cookingTime\": \"short\", \"ingredients\": [\"Licensed Bamboo Computer\", \"Sleek Granite Fish\", \"Sleek Rubber Shoes\"], \"willingToShop\": true, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL),(11,11,'{\"data\": {\"comments\": \"Ver amicitia deripio vox verecundia.\", \"cookingTime\": \"medium\", \"ingredients\": [\"Generic Granite Bike\", \"Incredible Bamboo Fish\", \"Refined Concrete Keyboard\"], \"willingToShop\": false, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL),(12,12,'{\"data\": {\"comments\": \"Desipio circumvenio adaugeo cattus vivo solio.\", \"cookingTime\": \"medium\", \"ingredients\": [\"Soft Gold Chair\", \"Elegant Steel Mouse\", \"Recycled Rubber Salad\"], \"willingToShop\": true, \"dietaryRestrictions\": []}}','2025-02-10 11:19:52.701','2025-02-10 11:19:52.701',NULL,NULL);
/*!40000 ALTER TABLE `userPrompts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userRecipes`
--

DROP TABLE IF EXISTS `userRecipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userRecipes` (
  `userId` int NOT NULL,
  `recipeId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`userId`,`recipeId`),
  KEY `userRecipes_recipeId_fkey` (`recipeId`),
  CONSTRAINT `userRecipes_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `userRecipes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userRecipes`
--

LOCK TABLES `userRecipes` WRITE;
/*!40000 ALTER TABLE `userRecipes` DISABLE KEYS */;
INSERT INTO `userRecipes` VALUES (7,8,'2025-02-10 11:19:52.901'),(7,11,'2025-02-10 11:19:52.901'),(7,12,'2025-02-10 11:19:52.901'),(8,8,'2025-02-10 11:19:52.901'),(8,9,'2025-02-10 11:19:52.901'),(8,12,'2025-02-10 11:19:52.901'),(9,7,'2025-02-10 11:19:52.901'),(9,8,'2025-02-10 11:19:52.901'),(10,9,'2025-02-10 11:19:52.901'),(10,10,'2025-02-10 11:19:52.901'),(10,11,'2025-02-10 11:19:52.901'),(10,12,'2025-02-10 11:19:52.901'),(11,7,'2025-02-10 11:19:52.901'),(11,10,'2025-02-10 11:19:52.901'),(11,11,'2025-02-10 11:19:52.901'),(12,7,'2025-02-10 11:19:52.901'),(12,9,'2025-02-10 11:19:52.901'),(12,10,'2025-02-10 11:19:52.901');
/*!40000 ALTER TABLE `userRecipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `oauthId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauthProvider` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'Eleanor Lakin','Russ27@gmail.com','yQVTfg1j6AMn0Tk','2025-02-10 11:19:52.520','2025-02-10 11:19:52.520',NULL,NULL,NULL),(8,'Franklin O\'Hara','Lane47@gmail.com','CVQkR5EWzlcKzzS','2025-02-10 11:19:52.520','2025-02-10 11:19:52.520',NULL,NULL,NULL),(9,'Ron Hand','Elva_Kilback93@hotmail.com','hqEEU_7akNnfgIb','2025-02-10 11:19:52.521','2025-02-10 11:19:52.521',NULL,NULL,NULL),(10,'Ms. Lynne Halvorson','Madalyn_Larkin@gmail.com','Pm2KuaSidBBihhm','2025-02-10 11:19:52.521','2025-02-10 11:19:52.521',NULL,NULL,NULL),(11,'Percy Skiles','Elmo.Kub4@gmail.com','XdtB6fdmn6sUcOy','2025-02-10 11:19:52.521','2025-02-10 11:19:52.521',NULL,NULL,NULL),(12,'Test User','admin@admin.com','$2b$10$dt7.5JyyozNXfCQwa.pw3.M7m9hO181tDuRd5qn2MmHOBW0j8h/16','2025-02-10 11:19:52.644','2025-02-10 11:19:52.644',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `recipe_times`
--

/*!50001 DROP VIEW IF EXISTS `recipe_times`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `recipe_times` AS select `recipes`.`id` AS `id`,`recipes`.`name` AS `name`,(json_extract(`recipes`.`prep`,'$.value') + json_extract(`recipes`.`cook`,'$.value')) AS `total_recipe_time` from `recipes` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:38:03
