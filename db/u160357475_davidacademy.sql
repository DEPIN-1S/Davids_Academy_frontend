-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2025 at 04:42 AM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u160357475_davidacademy`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `cs_id` int(11) NOT NULL,
  `cs_name` varchar(500) DEFAULT NULL,
  `cs_sub_title` varchar(500) DEFAULT NULL,
  `cs_description` text DEFAULT NULL,
  `cs_desc_points` text DEFAULT NULL,
  `cs_image` varchar(500) NOT NULL,
  `cs_status` varchar(500) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DragAndDrop_Headings`
--

CREATE TABLE `DragAndDrop_Headings` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `headings` varchar(500) NOT NULL,
  `drag_drop_answer` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DragAndDrop_Headings_Options`
--

CREATE TABLE `DragAndDrop_Headings_Options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `headings_id` int(11) NOT NULL,
  `options_value` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_additionalInfo`
--

CREATE TABLE `tb_additionalInfo` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `info` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_contact_us`
--

CREATE TABLE `tb_contact_us` (
  `cu_id` int(11) NOT NULL,
  `cu_name` varchar(255) NOT NULL,
  `cu_email` varchar(255) NOT NULL,
  `cu_mobile` varchar(20) DEFAULT NULL,
  `cu_course_interested` varchar(255) DEFAULT NULL,
  `cu_message` text DEFAULT NULL,
  `cu_created_at` timestamp NULL DEFAULT current_timestamp(),
  `cu_status` varchar(50) DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_dropdownOptions`
--

CREATE TABLE `tb_dropdownOptions` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `dropdowntext_id` int(11) NOT NULL,
  `dropdownValue` varchar(255) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_dropdowns`
--

CREATE TABLE `tb_dropdowns` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `dropdownField` varchar(255) NOT NULL,
  `dropdownanswer` varchar(255) DEFAULT NULL,
  `blankOrNot` varchar(500) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_explanation`
--

CREATE TABLE `tb_explanation` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `explanation` longtext DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_fillTheBlanks`
--

CREATE TABLE `tb_fillTheBlanks` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question_text` varchar(500) NOT NULL,
  `answers` varchar(500) NOT NULL,
  `blankOrNot` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_fillTheBlanks_options`
--

CREATE TABLE `tb_fillTheBlanks_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_heading` varchar(500) NOT NULL,
  `options_vlaue` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_marklist`
--

CREATE TABLE `tb_marklist` (
  `id` int(11) NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `testId` int(11) DEFAULT NULL,
  `testStatus` tinyint(4) DEFAULT NULL COMMENT '1-ongoing,2-completed',
  `mark` double DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_mcqOptions`
--

CREATE TABLE `tb_mcqOptions` (
  `id` int(11) NOT NULL,
  `option` varchar(255) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `questionId` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_MultipleRadio`
--

CREATE TABLE `tb_MultipleRadio` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `client_findings` varchar(500) NOT NULL,
  `answer` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_MultipleRadio_RadioOptions`
--

CREATE TABLE `tb_MultipleRadio_RadioOptions` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `options` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_notes`
--

CREATE TABLE `tb_notes` (
  `n_id` int(11) NOT NULL,
  `n_user_id` int(11) NOT NULL,
  `n_title` varchar(255) NOT NULL,
  `n_description` varchar(1000) DEFAULT NULL,
  `n_status` varchar(50) DEFAULT 'pending',
  `n_is_deleted` tinyint(4) DEFAULT 0,
  `n_created_at` timestamp NULL DEFAULT current_timestamp(),
  `n_updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_questions`
--

CREATE TABLE `tb_questions` (
  `id` int(11) NOT NULL,
  `question` longtext NOT NULL,
  `question_type_id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `answer` varchar(255) DEFAULT NULL COMMENT 'Answers for MCQ ,sentence highlight question,Fill in the blanks',
  `marks` double NOT NULL,
  `exam_type` varchar(500) NOT NULL,
  `drag_drop_content` varchar(500) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `exhibit` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_questionTabs`
--

CREATE TABLE `tb_questionTabs` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `tabKey` varchar(255) NOT NULL,
  `tabValue` longtext NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_questionType`
--

CREATE TABLE `tb_questionType` (
  `id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` varchar(500) NOT NULL DEFAULT 'active',
  `isDeleted` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_recordings`
--

CREATE TABLE `tb_recordings` (
  `r_id` int(11) NOT NULL,
  `r_thumbnail` varchar(255) DEFAULT NULL,
  `r_title` varchar(255) DEFAULT NULL,
  `r_course` int(11) DEFAULT NULL,
  `r_duration` varchar(50) DEFAULT NULL,
  `r_tutor_name` varchar(100) DEFAULT NULL,
  `r_video_url` varchar(255) DEFAULT NULL,
  `r_created_at` timestamp NULL DEFAULT current_timestamp(),
  `r_update_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_sentanceHighlight`
--

CREATE TABLE `tb_sentanceHighlight` (
  `id` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `options` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_sortItems`
--

CREATE TABLE `tb_sortItems` (
  `id` int(11) NOT NULL,
  `questionId` int(11) DEFAULT NULL,
  `sortItem` varchar(255) NOT NULL,
  `itemOrder` int(11) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_submittedQuestions`
--

CREATE TABLE `tb_submittedQuestions` (
  `sq_id` int(11) NOT NULL,
  `sq_user_id` int(11) NOT NULL,
  `sq_test_id` int(11) NOT NULL,
  `sq_question_id` int(11) NOT NULL,
  `sq_is_correct` tinyint(1) DEFAULT NULL,
  `sq_mark` float DEFAULT NULL,
  `sq_created_at` timestamp NULL DEFAULT current_timestamp(),
  `sq_updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_submittedTest`
--

CREATE TABLE `tb_submittedTest` (
  `st_id` int(11) NOT NULL,
  `st_user_id` int(11) NOT NULL,
  `st_test_id` int(11) NOT NULL,
  `st_score` double DEFAULT NULL,
  `st_created_at` timestamp NULL DEFAULT current_timestamp(),
  `st_updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_testQuestions`
--

CREATE TABLE `tb_testQuestions` (
  `id` int(11) NOT NULL,
  `testId` int(11) DEFAULT NULL,
  `questionId` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_tests`
--

CREATE TABLE `tb_tests` (
  `id` int(11) NOT NULL,
  `fromDate` date DEFAULT NULL,
  `toDate` date DEFAULT NULL,
  `testTitle` varchar(100) DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `role` varchar(500) NOT NULL DEFAULT 'user',
  `created_At` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `target_exam` int(11) DEFAULT NULL,
  `class_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`cs_id`);

--
-- Indexes for table `DragAndDrop_Headings`
--
ALTER TABLE `DragAndDrop_Headings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `DragAndDrop_Headings_Options`
--
ALTER TABLE `DragAndDrop_Headings_Options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_additionalInfo`
--
ALTER TABLE `tb_additionalInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_contact_us`
--
ALTER TABLE `tb_contact_us`
  ADD PRIMARY KEY (`cu_id`);

--
-- Indexes for table `tb_dropdownOptions`
--
ALTER TABLE `tb_dropdownOptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `tb_dropdowns`
--
ALTER TABLE `tb_dropdowns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `tb_explanation`
--
ALTER TABLE `tb_explanation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `tb_fillTheBlanks`
--
ALTER TABLE `tb_fillTheBlanks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_fillTheBlanks_options`
--
ALTER TABLE `tb_fillTheBlanks_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_marklist`
--
ALTER TABLE `tb_marklist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_mcqOptions`
--
ALTER TABLE `tb_mcqOptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `tb_MultipleRadio`
--
ALTER TABLE `tb_MultipleRadio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_MultipleRadio_RadioOptions`
--
ALTER TABLE `tb_MultipleRadio_RadioOptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_notes`
--
ALTER TABLE `tb_notes`
  ADD PRIMARY KEY (`n_id`);

--
-- Indexes for table `tb_questions`
--
ALTER TABLE `tb_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_questionTabs`
--
ALTER TABLE `tb_questionTabs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `tb_questionType`
--
ALTER TABLE `tb_questionType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_recordings`
--
ALTER TABLE `tb_recordings`
  ADD PRIMARY KEY (`r_id`);

--
-- Indexes for table `tb_sentanceHighlight`
--
ALTER TABLE `tb_sentanceHighlight`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_sortItems`
--
ALTER TABLE `tb_sortItems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_submittedQuestions`
--
ALTER TABLE `tb_submittedQuestions`
  ADD PRIMARY KEY (`sq_id`);

--
-- Indexes for table `tb_submittedTest`
--
ALTER TABLE `tb_submittedTest`
  ADD PRIMARY KEY (`st_id`);

--
-- Indexes for table `tb_testQuestions`
--
ALTER TABLE `tb_testQuestions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_tests`
--
ALTER TABLE `tb_tests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `cs_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DragAndDrop_Headings`
--
ALTER TABLE `DragAndDrop_Headings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DragAndDrop_Headings_Options`
--
ALTER TABLE `DragAndDrop_Headings_Options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_additionalInfo`
--
ALTER TABLE `tb_additionalInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_contact_us`
--
ALTER TABLE `tb_contact_us`
  MODIFY `cu_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_dropdownOptions`
--
ALTER TABLE `tb_dropdownOptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_dropdowns`
--
ALTER TABLE `tb_dropdowns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_explanation`
--
ALTER TABLE `tb_explanation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_fillTheBlanks`
--
ALTER TABLE `tb_fillTheBlanks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_fillTheBlanks_options`
--
ALTER TABLE `tb_fillTheBlanks_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_marklist`
--
ALTER TABLE `tb_marklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_mcqOptions`
--
ALTER TABLE `tb_mcqOptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_MultipleRadio`
--
ALTER TABLE `tb_MultipleRadio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_MultipleRadio_RadioOptions`
--
ALTER TABLE `tb_MultipleRadio_RadioOptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_notes`
--
ALTER TABLE `tb_notes`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_questions`
--
ALTER TABLE `tb_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_questionTabs`
--
ALTER TABLE `tb_questionTabs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_questionType`
--
ALTER TABLE `tb_questionType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_recordings`
--
ALTER TABLE `tb_recordings`
  MODIFY `r_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_sentanceHighlight`
--
ALTER TABLE `tb_sentanceHighlight`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_sortItems`
--
ALTER TABLE `tb_sortItems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_submittedQuestions`
--
ALTER TABLE `tb_submittedQuestions`
  MODIFY `sq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_submittedTest`
--
ALTER TABLE `tb_submittedTest`
  MODIFY `st_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_testQuestions`
--
ALTER TABLE `tb_testQuestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_tests`
--
ALTER TABLE `tb_tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_mcqOptions`
--
ALTER TABLE `tb_mcqOptions`
  ADD CONSTRAINT `tb_mcqOptions_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `tb_questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
