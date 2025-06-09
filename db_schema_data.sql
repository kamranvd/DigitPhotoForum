
CREATE DATABASE IF NOT EXISTS `digital_photography_forum`;


USE `digital_photography_forum`;

DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL, 
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255),
    `content` TEXT NOT NULL,
    `category_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


CREATE TABLE `answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT NOT NULL,
    `question_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


INSERT INTO `users` (`username`, `password`) VALUES
('photoguy', 'password123'),
('lenslover', 'securepass'),
('shutterbug', 'myphotoapp');


INSERT INTO `categories` (`name`, `description`) VALUES
('Cameras', 'Discussions about DSLR, Mirrorless, Compact, and Film Cameras.'),
('Lenses', 'All about prime lenses, zoom lenses, telephoto, wide-angle, and macro lenses.'),
('Editing Software', 'Questions and tips for Photoshop, Lightroom, Capture One, GIMP, and other photo editing tools.'),
('Lighting', 'Topics on natural light, studio strobes, speedlights, modifiers, and continuous lighting.'),
('Composition', 'Tips and techniques for framing, rule of thirds, leading lines, and visual balance.'),
('Accessories', 'Bags, tripods, filters, memory cards, and other essential gear.');


INSERT INTO `questions` (`title`, `content`, `category_id`, `user_id`) VALUES
('Best mirrorless camera for beginners?', 'I\'m looking to buy my first mirrorless camera. What would you recommend for a beginner, focusing on ease of use and good image quality?', (SELECT id FROM categories WHERE name = 'Cameras'), (SELECT id FROM users WHERE username = 'photoguy')),
('Prime vs Zoom Lens for Portraits?', 'I shoot a lot of portraits. Should I invest in a prime lens or a versatile zoom lens for the best results?', (SELECT id FROM categories WHERE name = 'Lenses'), (SELECT id FROM users WHERE username = 'lenslover')),
('Lightroom alternatives for Mac?', 'I\'m looking for a good photo editing software alternative to Adobe Lightroom for my Mac. Any suggestions that are less subscription-based?', (SELECT id FROM categories WHERE name = 'Editing Software'), (SELECT id FROM users WHERE username = 'shutterbug')),
('How to use natural light for indoor portraits?', 'I struggle with indoor portraits using only natural light. What are some effective techniques or quick tips to improve my shots?', (SELECT id FROM categories WHERE name = 'Lighting'), (SELECT id FROM users WHERE username = 'photoguy')),
('Improving landscape composition?', 'I\'m trying to improve my landscape photography. What are some advanced composition techniques I should be practicing?', (SELECT id FROM categories WHERE name = 'Composition'), (SELECT id FROM users WHERE username = 'lenslover'));


INSERT INTO `answers` (`content`, `question_id`, `user_id`) VALUES
('For beginners, the Sony a6100 or Fujifilm X-T200 are great mirrorless options. They both have excellent autofocus and user-friendly interfaces.', (SELECT id FROM questions WHERE title = 'Best mirrorless camera for beginners?'), (SELECT id FROM users WHERE username = 'lenslover')),
('Definitely a prime lens for portraits! Something like a 50mm f/1.8 gives incredible bokeh and sharpness for the price.', (SELECT id FROM questions WHERE title = 'Prime vs Zoom Lens for Portraits?'), (SELECT id FROM users WHERE username = 'photoguy')),
('Capture One is fantastic, though it has a learning curve. Affinity Photo is also a powerful one-time purchase alternative.', (SELECT id FROM questions WHERE title = 'Lightroom alternatives for Mac?'), (SELECT id FROM users WHERE username = 'lenslover')),
('The key is to find good window light and position your subject correctly relative to it. Avoid direct sunlight and use reflectors!', (SELECT id FROM questions WHERE title = 'How to use natural light for indoor portraits?'), (SELECT id FROM users WHERE username = 'shutterbug'));
