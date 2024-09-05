export interface Assignment {
	assignment_id: number;
	course_id: number;
	title: string;
	description: string;
	due_date: string;
	private?: boolean;
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
	instructor_id: string;
	course_image_url: string;
	professor_name: string;
	assignments: Assignment[];
}
