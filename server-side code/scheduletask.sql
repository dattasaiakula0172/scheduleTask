-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2024 at 12:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `scheduletask`
--

CREATE TABLE `scheduletask` (
  `task_id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `subject` varchar(50) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `rep` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scheduletask`
--

INSERT INTO `scheduletask` (`task_id`, `title`, `description`, `subject`, `frequency`, `rep`, `time`) VALUES
(38, 'Ravi', 'VIVO f19 | 128GB', 'Hhdghb bjvdjcvdjs ', 'Daily', 'First Monday', '11:45'),
(42, 'React Dev', 'Front-end Dev', 'Task', 'Weekly', 'Web', '11:00'),
(47, 'Hello', 'World', 'Meeting', 'Monthly', 'Last Friday', '10:10'),
(48, 'Developer', 'Software Developer', 'Fresher', 'Weekly', 'Tue', '22:00'),
(49, 'Demo', 'Demo.....', 'Testing Perpouse', 'Daily', '', '22:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scheduletask`
--
ALTER TABLE `scheduletask`
  ADD PRIMARY KEY (`task_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scheduletask`
--
ALTER TABLE `scheduletask`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
