-- Drop existing tables if they exist
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor')),
    profile_image_url TEXT
);

-- Courses table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_description TEXT,
    instructor_id INT NOT NULL,
    course_image_url TEXT,
    professor_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Grades table
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    grade DECIMAL(5, 2) CHECK (grade >= 0 AND grade <= 100),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (username, email, password, first_name, last_name, role, profile_image_url)
VALUES
('johndoe', 'johndoe@example.com', 'hashedpassword1', 'John', 'Doe', 'student', 'https://example.com/images/johndoe.jpg'),
('janedoe', 'janedoe@example.com', 'hashedpassword2', 'Jane', 'Doe', 'student', 'https://example.com/images/janedoe.jpg'),
('profsmith', 'profsmith@example.com', 'hashedpassword3', 'Professor', 'Smith', 'instructor', 'https://example.com/images/profsmith.jpg');

-- Insert sample courses
INSERT INTO courses (course_name, course_description, instructor_id, course_image_url, professor_name)
VALUES
('Introduction to Programming', 'Learn the basics of programming.', 3, 'https://example.com/images/intro_to_programming.jpg', 'Professor Smith'),
('Advanced Mathematics', 'Dive deep into advanced mathematical concepts.', 3, 'https://example.com/images/advanced_math.jpg', 'Professor Smith');

-- Insert sample enrollments with sections
INSERT INTO enrollments (course_id, student_id, section)
VALUES
(1, 1, '001'), -- John Doe in section 001 of Introduction to Programming
(1, 2, '002'), -- Jane Doe in section 002 of Introduction to Programming
(2, 1, '001'); -- John Doe in section 001 of Advanced Mathematics

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date)
VALUES
(1, 'Homework 1', 'Complete the programming exercises.', '2023-08-31 23:59:59'),
(1, 'Project 1', 'Build a small web application.', '2023-09-30 23:59:59'),
(2, 'Math Assignment 1', 'Solve the provided math problems.', '2023-08-25 23:59:59');

-- Insert sample grades
INSERT INTO grades (assignment_id, student_id, grade)
VALUES
(1, 1, 95.5),
(1, 2, 88.0),
(2, 1, 92.0),
(3, 1, 85.0);
