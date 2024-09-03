export interface Assignment {
	assignment_id: number;
	course_id: number; // Add this line if it's valid
	title: string;
	description: string;
	due_date: string; // Assuming you have a due_date field
}

export interface AssignmentDisplay {
	title: string;
	dueDate: string;
}

export interface Course {
	course_id: number;
	course_code: string;
	course_name: string;
	course_description: string;
	instructor_id: number;
	course_image_url: string;
	professor_name: string;
}
