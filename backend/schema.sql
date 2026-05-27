CREATE DATABASE IF NOT EXISTS backlog_db;
USE backlog_db;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `movies_shows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `movie_show_id` int NOT NULL,
  `type` ENUM('movie', 'show') NOT NULL DEFAULT 'movie',
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('not_started', 'completed') DEFAULT 'not_started',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  UNIQUE (`user_id`, `movie_show_id`, `type`),
  CONSTRAINT `movies_shows_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `refresh_tokens` (
  id INT NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);