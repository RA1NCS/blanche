'use client';

import { useState, useEffect } from 'react';

export default function AssignmentPage({
	params,
}: {
	params: { courseID: string; assignmentID: string };
}) {
	const [assignment, setAssignment] = useState<any>(null);
	const [submissionText, setSubmissionText] = useState<string>('');
	const [submissionFile, setSubmissionFile] = useState<File | null>(null);

	useEffect(() => {
		async function fetchAssignment() {
			try {
				const res = await fetch(
					`/api/courses/${params.courseID}/assignments/${params.assignmentID}`
				);
				const data = await res.json();
				setAssignment(data);
			} catch (error) {
				console.error('Failed to fetch assignment:', error);
			}
		}

		fetchAssignment();
	}, [params.courseID, params.assignmentID]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSubmissionFile(file);
	};

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append('submissionText', submissionText);
		if (submissionFile) {
			formData.append('submissionFile', submissionFile);
		}

		try {
			await fetch(
				`/api/courses/${params.courseID}/assignments/${params.assignmentID}/submit`,
				{
					method: 'POST',
					body: formData,
				}
			);
			alert('Submission successful');
		} catch (error) {
			console.error('Failed to submit:', error);
		}
	};

	return (
		<div className="p-8">
			{assignment ? (
				<>
					<h1 className="text-3xl font-bold mb-4">
						{assignment.title}
					</h1>
					<p className="mb-4">{assignment.content}</p>
					{assignment.attachment_url && (
						<a
							href={
								assignment.attachment_url
							}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline"
						>
							Download Attachment
						</a>
					)}

					<div className="mt-8">
						<h2 className="text-xl font-semibold">
							Submit Your Work
						</h2>
						<textarea
							className="w-full border p-2 mt-4"
							placeholder="Enter your submission text"
							value={submissionText}
							onChange={(e) =>
								setSubmissionText(
									e.target
										.value
								)
							}
						></textarea>
						<input
							type="file"
							className="mt-4"
							onChange={handleFileChange}
						/>
						<button
							className="mt-4 bg-blue-500 text-white p-2 rounded"
							onClick={handleSubmit}
						>
							Submit
						</button>
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
