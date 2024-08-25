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

-- Insert sample users
INSERT INTO users (username, email, password, first_name, last_name, role, profile_image_url)
VALUES
('johndoe', 'johndoe@example.com', 'hashedpassword1', 'John', 'Doe', 'student', 'https://example.com/images/johndoe.jpg'),
('janedoe', 'janedoe@example.com', 'hashedpassword2', 'Jane', 'Doe', 'student', 'https://example.com/images/janedoe.jpg'),
('profsmith', 'profsmith@example.com', 'hashedpassword3', 'Professor', 'Smith', 'instructor', 'https://example.com/images/profsmith.jpg'),
('profjohnson', 'profjohnson@example.com', 'hashedpassword4', 'Professor', 'Johnson', 'instructor', 'https://example.com/images/profjohnson.jpg'),
('profwilliams', 'profwilliams@example.com', 'hashedpassword5', 'Professor', 'Williams', 'instructor', 'https://example.com/images/profwilliams.jpg');

-- Courses table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    course_description TEXT,
    instructor_id INT NOT NULL,
    course_image_url TEXT,
    professor_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert sample courses based on Drexel CS major classes
INSERT INTO courses (course_code, course_name, course_description, instructor_id, course_image_url, professor_name)
VALUES
('CS 164', 'Introduction to Computer Science', 'An introductory course covering the basics of programming and computer science.', 3, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Smith'),
('CS 172', 'Data Structures', 'Learn about fundamental data structures such as arrays, lists, trees, and graphs.', 4, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Johnson'),
('CS 240', 'Discrete Mathematics', 'An introduction to discrete mathematics and its applications in computer science.', 5, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Williams'),
('CS 260', 'Computer Architecture', 'Study the structure and function of modern computer architectures.', 3, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Smith'),
('CS 270', 'Software Engineering', 'Learn the principles and practices of software engineering and project management.', 4, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Johnson'),
('CS 283', 'Database Systems', 'An in-depth look at database design, SQL, and the management of database systems.', 5, 'https://cdn.vectorstock.com/i/500p/31/88/horizontal-banner-with-hands-typing-on-computer-vector-20863188.jpg', 'Professor Williams');

-- Enrollments table
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert sample enrollments with sections
INSERT INTO enrollments (course_id, student_id, section)
VALUES
(1, 1, '001'), -- John Doe in section 001 of CS164
(2, 2, '001'), -- Jane Doe in section 001 of CS172
(3, 1, '002'), -- John Doe in section 002 of CS240
(4, 1, '001'), -- John Doe in section 001 of CS260
(5, 2, '002'); -- Jane Doe in section 002 of CS270

-- Assignments table
CREATE TABLE assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    content TEXT,
    attachment_url TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date)
VALUES
(1, 'Homework 1', 'Complete the initial setup for the programming project.', '2023-08-31 23:59:59'),
(1, 'Midterm Project', 'Build a basic software project following the course guidelines.', '2023-09-30 23:59:59'),
(2, 'Assignment 1', 'Solve problems related to data structures and algorithms.', '2023-08-25 23:59:59'),
(3, 'Homework 1', 'Prove theorems using discrete mathematics.', '2023-09-05 23:59:59'),
(4, 'Lab Assignment 1', 'Write assembly code to implement given algorithms.', '2023-09-10 23:59:59'),
(5, 'Project Proposal', 'Submit a proposal for the final software engineering project.', '2023-09-15 23:59:59');

-- Grades table
CREATE TABLE student_submissions (
    submission_id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text TEXT,
    submission_file_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Insert sample grades
INSERT INTO grades (assignment_id, student_id, grade)
VALUES
(1, 1, 95.5),
(2, 2, 88.0),
(3, 1, 92.0),
(4, 1, 85.0),
(5, 2, 90.0);
