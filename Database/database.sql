CREATE DATABASE  IF NOT EXISTS `HyperStyle` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `HyperStyle`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Server version	8.0.40 a

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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` varchar(36) NOT NULL,
  `id_user` varchar(36) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roles` enum('ROLE_ADMIN','ROLE_EMLOYEE','ROLE_USER') DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mfisqiulqmeyv1vpx65qqcbv` (`id_user`),
  CONSTRAINT `FKr738a8wol7on2r69xf3iuvggx` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('0aa1a44c-423f-477e-8fec-cc9b3e9df608','6ef0346a-bb6d-4afc-8443-4bd5164a68be','kawatoxdx4@gmail.com','$2a$10$1y7WAB08XJiSBBQVIjdWveA2mz3m1nYvk6sNeSidy5lKXNYnmvfqC','ROLE_USER','DANG_SU_DUNG'),
('0b755264-6e7e-41eb-b602-24ba0bdaeffb','64d07320-81a0-4f59-8da2-83019ad08653','tuan@gmail.com','$2a$10$33UAq3TCbUHpKkYi1GHwiuOYqwhZ1NnoWihauBn0gsaDrxrNypWve','ROLE_EMLOYEE','DANG_SU_DUNG'),
('20fbee0d-1248-4565-8d8c-178083cde65e','1ad3e570-2901-4687-b14a-69e35323de0f','chinhndph41905@fpt.edu.vn','$2a$10$HxtNlCBfWaVl6Oa1smle4OO1oJ9lktCBJOAE9/QUlyVwvsvDBVqK6','ROLE_USER','DANG_SU_DUNG'),
('a9c42ee1-3729-4d0f-b3af-1631ae39a5f0','c2e55616-f359-40d1-8eda-4377018f5c4d','kawatoxdx2@gmail.com','$2a$10$Mj5B1cwFHY9a7TH6.SMDQuWY06ez.uOmbdPzkPlrhFKtKga4ZZx7O','ROLE_USER','DANG_SU_DUNG'),
('d34e5c25-e578-4c85-8b41-52a65c127c12','67aab7eb-4ab0-4107-a82f-19906d951170','kawatoxdx3@gmail.com','$2a$10$qvb38R6VBnQcsrpwXMBe/.H2VLDvSeGa4e9nywDhp0yEOZt3un5Xy','ROLE_USER','DANG_SU_DUNG'),
('c8680679-f07a-4f21-9d54-7a46e3f1f670','87202f1b-d304-4614-b354-46cdd68c06a3','kawatoxdx@gmail.com','$2a$10$vWCqKyblibScTLhiKezW2ej669Jjcu0R0icEgesdGJuUfW9IbpvMG','ROLE_ADMIN','DANG_SU_DUNG'),
('d1c5039f-22e7-4c81-af5a-ed82691e4aba','348ebfce-71e7-432a-bbae-ffb317e22329','kawatoxdx5@gmail.com','$2a$10$2Q/IYqCqrVH7dHxJ4JofY./NeM3KoDEb89I4G2SJuV3DBVheqlsF6','ROLE_USER','DANG_SU_DUNG');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;




DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` varchar(36) NOT NULL,
  `id_user` varchar(36) DEFAULT NULL,
  `line` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `ward_code` varchar(255) DEFAULT NULL,
  `province_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpmtr515lcs96s5mnrhbakm096` (`id_user`),
  CONSTRAINT `FKpmtr515lcs96s5mnrhbakm096` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ();
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill` (
  `id` varchar(36) NOT NULL,
  `id_account` varchar(36) DEFAULT NULL,
  `id_employees` varchar(36) DEFAULT NULL,
  `id_voucher` varchar(36) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `item_discount` decimal(38,2) DEFAULT NULL,
  `total_money` decimal(38,2) DEFAULT NULL,
  `befor_price` decimal(38,2) DEFAULT NULL,
  `after_price` decimal(38,2) DEFAULT NULL,
  `discount_price` decimal(38,2) DEFAULT NULL,
  `confirmation_date` date DEFAULT NULL,
  `shipping_date` date DEFAULT NULL,
  `receive_date` date DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `type` enum('OFFLINE','ONLINE') DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `money_ship` decimal(38,2) DEFAULT NULL,
  `status_bill` enum('CHO_VAN_CHUYEN','CHO_XAC_NHAN','DA_HUY','DA_THANH_TOAN','TAO_HOA_DON','THANH_CONG','VAN_CHUYEN','XAC_NHAN') DEFAULT NULL,
  `last_modified_date` date DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtc4upfd79unhwfqo7iem118lv` (`id_account`),
  KEY `FKkeqk1fp13v425tc98dsxk2svt` (`id_employees`),
  KEY `FKg8m3nqf25xvt8p7k9l3j4h2z` (`id_voucher`),
  CONSTRAINT `FKg8m3nqf25xvt8p7k9l3j4h2z` FOREIGN KEY (`id_voucher`) REFERENCES `voucher` (`id`),
  CONSTRAINT `FKkeqk1fp13v425tc98dsxk2svt` FOREIGN KEY (`id_employees`) REFERENCES `account` (`id`),
  CONSTRAINT `FKtc4upfd79unhwfqo7iem118lv` FOREIGN KEY (`id_account`) REFERENCES `account` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
INSERT INTO `bill` VALUES ();
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_detail`
--

DROP TABLE IF EXISTS `bill_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_detail` (
  `id` varchar(36) NOT NULL,
  `id_product_detail` varchar(36) DEFAULT NULL,
  `id_bill` varchar(36) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `status_bill` enum('CHO_VAN_CHUYEN','CHO_XAC_NHAN','DA_HUY','DA_THANH_TOAN','TAO_HOA_DON','THANH_CONG','VAN_CHUYEN','XAC_NHAN') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiu3wwq39mr69wsbklret9mtki` (`id_bill`),
  KEY `FKcpo5ddp6aci7g8f4jjaj6730n` (`id_product_detail`),
  CONSTRAINT `FKcpo5ddp6aci7g8f4jjaj6730n` FOREIGN KEY (`id_product_detail`) REFERENCES `product_detail` (`id`),
  CONSTRAINT `FKiu3wwq39mr69wsbklret9mtki` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_detail`
--

LOCK TABLES `bill_detail` WRITE;
/*!40000 ALTER TABLE `bill_detail` DISABLE KEYS */;
INSERT INTO `bill_detail` VALUES ();
/*!40000 ALTER TABLE `bill_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_history`
--

DROP TABLE IF EXISTS `bill_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_history` (
  `id` varchar(36) NOT NULL,
  `id_employees` varchar(36) DEFAULT NULL,
  `id_bill` varchar(36) DEFAULT NULL,
  `action_description` varchar(255) DEFAULT NULL,	
  `created_date` date DEFAULT NULL,
  `last_modified_date` date DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `status_bill` enum('CHO_VAN_CHUYEN','CHO_XAC_NHAN','DA_HUY','DA_THANH_TOAN','TAO_HOA_DON','THANH_CONG','VAN_CHUYEN','XAC_NHAN') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs3bxwm3kx9ats78kht029sgi6` (`id_bill`),
  KEY `FK7sp1p0scmgwg3v9bx4estdjot` (`id_employees`),
  CONSTRAINT `FK7sp1p0scmgwg3v9bx4estdjot` FOREIGN KEY (`id_employees`) REFERENCES `account` (`id`),
  CONSTRAINT `FKs3bxwm3kx9ats78kht029sgi6` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_history`
--

LOCK TABLES `bill_history` WRITE;
/*!40000 ALTER TABLE `bill_history` DISABLE KEYS */;
INSERT INTO `bill_history` VALUES ();
/*!40000 ALTER TABLE `bill_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES ('08f00748-5ce0-4d6a-a5ff-825dcce4ff3d', 'Adidas','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),   
('595adf7b-2fbf-4a33-ba18-55eb26db8bc5', 'Converse','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),   
('9682c900-e812-4a44-86b9-6886f78ef281','Nike','DANG_SU_DUNG', 'd69164ec-11b8-11ee-be56-0242ac120002'),   
('d30dc7c1-0900-4c46-9466-c319df306569','Babolat','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` varchar(36) NOT NULL,
  `id_product_detail` varchar(36) DEFAULT NULL,
  `id_account` varchar(36) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_7ci11mfeso55kc1d8ou1qhc6k` (`id_account`),
  KEY `FKdfxy2d5s6cke2rwma1u3w68en` (`id_product_detail`),
  CONSTRAINT `FKldb5k6mk67oudki8jgt7ri03h` FOREIGN KEY (`id_account`) REFERENCES `account` (`id`),
  CONSTRAINT `FKdfxy2d5s6cke2rwma1u3w68en` FOREIGN KEY (`id_product_detail`) REFERENCES `product_detail` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ();
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('4c2c20e6-f598-4b65-b4df-e4194c158da1','boot','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('d22584dc-54e3-4009-ab77-f9d50d5fe553','Sneakers','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES ('0bb6ce89-5157-43a7-bd8f-277ab434da8f','red','#fa0000','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002')
,('1f4aab75-2366-4e74-844a-3969db23ed94','Cloud White','#F4FAFC','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002')
,('c1b58df5-5f06-42bc-8632-da79d00459c7','black','#000000','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `id` varchar(36) NOT NULL,
  `id_product` varchar(36) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs4kpgowlj28nnxbw7r2gk3m9r` (`id_product`),
  CONSTRAINT `FKs4kpgowlj28nnxbw7r2gk3m9r` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES ();
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES ('8861490a-525d-4cef-8388-7fbde61c2f2a','Da Bò','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('f4cd445f-72d4-41ac-9975-378da8c5f199','Cotton','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments_method`
--

DROP TABLE IF EXISTS `payments_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments_method` (
  `id` varchar(36) NOT NULL,
  `id_bill` varchar(36) DEFAULT NULL,
  `id_employees` varchar(36) DEFAULT NULL,
  `method` enum('CHUYEN_KHOAN','TIEN_MAT') DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `total_money` decimal(38,2) DEFAULT NULL,
  `vnp_transaction` varchar(255) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `status` enum('CHUA_THANH_TOAN','DA_THANH_TOAN','THANH_TOAN','TRA_SAU') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4v5neyiaqyswqphbxdk0ucfio` (`id_bill`),
  KEY `FKl6da6jd0i9onbj9brkl7uts8v` (`id_employees`),
  CONSTRAINT `FK4v5neyiaqyswqphbxdk0ucfio` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id`),
  CONSTRAINT `FKl6da6jd0i9onbj9brkl7uts8v` FOREIGN KEY (`id_employees`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments_method`
--

LOCK TABLES `payments_method` WRITE;
/*!40000 ALTER TABLE `payments_method` DISABLE KEYS */;
INSERT INTO `payments_method` VALUES ();
/*!40000 ALTER TABLE `payments_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` varchar(36) NOT NULL,
  `id_material` varchar(36) DEFAULT NULL,
  `id_brand` varchar(36) DEFAULT NULL,
  `id_category` varchar(36) DEFAULT NULL,
  `id_sole` varchar(36) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsojh20lw9m01kycyhqw07hfla` (`id_brand`),
  KEY `FK7qtog5nlueu3wt2cyc1n4x8t9` (`id_category`),
  KEY `FKhgxo03bmh10q3vje0hofswwhc` (`id_sole`),
  KEY `FKb421xx5lew4qo2y1upk69e3ld` (`id_material`),
  CONSTRAINT `FKsojh20lw9m01kycyhqw07hfla` FOREIGN KEY (`id_brand`) REFERENCES `brand` (`id`),
  CONSTRAINT `FK7qtog5nlueu3wt2cyc1n4x8t9` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`),
  CONSTRAINT `FKb421xx5lew4qo2y1upk69e3ld` FOREIGN KEY (`id_material`) REFERENCES `material` (`id`),
  CONSTRAINT `FKfj5qpl72ghseei7k0pkr7tkev` FOREIGN KEY (`id_sole`) REFERENCES `sole` (`id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ();
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_detail`
--

DROP TABLE IF EXISTS `product_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_detail` (
  `id` varchar(36) NOT NULL,
  `id_size` varchar(36) DEFAULT NULL,
  `id_product` varchar(36) DEFAULT NULL,
  `id_color` varchar(36) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gender` enum('NAM','NAM_VA_NU','NU') DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiyk9npasmucg0xxq9ooc31g04` (`id_product`),
  KEY `FKklell1kj4i5npdyb7un3n55nj` (`id_size`),
  KEY `FKfj5qpl72ghseei7k0pkr7tkev` (`id_color`),
  CONSTRAINT `FKiyk9npasmucg0xxq9ooc31g04` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`),
  CONSTRAINT `FKklell1kj4i5npdyb7un3n55nj` FOREIGN KEY (`id_size`) REFERENCES `size` (`id`),
  CONSTRAINT `FKhgxo03bmh10q3vje0hofswwhc` FOREIGN KEY (`id_color`) REFERENCES `color` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_detail`
--

LOCK TABLES `product_detail` WRITE;
/*!40000 ALTER TABLE `product_detail` DISABLE KEYS */;
INSERT INTO `product_detail` VALUES ();
/*!40000 ALTER TABLE `product_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size`
--

LOCK TABLES `size` WRITE;
/*!40000 ALTER TABLE `size` DISABLE KEYS */;
INSERT INTO `size` VALUES ('0cfe128f-e339-4284-ace3-0e6ad9ca2e46',40,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('1081d766-e42a-44f1-8b07-ee5b3d060dd5',41,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('36d6894e-5e60-4b34-83af-1cfab8dc2c89',39,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('4fca4f12-c284-4010-a86e-5c9bde95b060',38,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('5f551a6f-bdde-471e-9bbf-8225de3ce8ea',36,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002'),
('ec9bce72-b8a5-4a2b-a1c7-24ec7dd52986',37,'DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sole`
--

DROP TABLE IF EXISTS `sole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sole` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sole`
--

LOCK TABLES `sole` WRITE;
/*!40000 ALTER TABLE `sole` DISABLE KEYS */;
INSERT INTO `sole` VALUES ('a73b78c2-224f-43d4-83df-0b4079a10944','Cao Su','DANG_SU_DUNG','d69164ec-11b8-11ee-be56-0242ac120002');
/*!40000 ALTER TABLE `sole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` bit(1) DEFAULT NULL,
  `avata` varchar(255) DEFAULT NULL,
  `citizen_identity` varchar(255) DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ();
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher` (
  `id` varchar(36) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` decimal(38,2) DEFAULT NULL, 
  `quantity` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `minimum_bill` int DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `status` enum('CHUA_DOC','CHUA_KICH_HOAT','DANG_SU_DUNG','DA_DOC','HET_SAN_PHAM','KHONG_SU_DUNG') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
INSERT INTO `voucher` VALUES ();
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher_detail`
--

DROP TABLE IF EXISTS `voucher_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher_detail` (
  `id` varchar(36) NOT NULL,
  `id_voucher` varchar(36) DEFAULT NULL,

  PRIMARY KEY (`id`),
  KEY `FKfc3ukisuvi92n8rikjn9245j6` (`id_voucher`),
  CONSTRAINT `FKfc3ukisuvi92n8rikjn9245j6` FOREIGN KEY (`id_voucher`) REFERENCES `voucher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_detail`
--

LOCK TABLES `voucher_detail` WRITE;
/*!40000 ALTER TABLE `voucher_detail` DISABLE KEYS */;
INSERT INTO `voucher_detail` VALUES ();
/*!40000 ALTER TABLE `voucher_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-12 18:12:31
