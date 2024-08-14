'use client';

import React from 'react';

const Loading: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen bg-white">
			<div className="flex space-x-3">
				<div className="animate-bounce1 w-4 h-4 bg-[#002F6C] rounded-full"></div>
				<div className="animate-bounce2 w-4 h-4 bg-[#002F6C] rounded-full"></div>
				<div className="animate-bounce3 w-4 h-4 bg-[#002F6C] rounded-full"></div>
			</div>
		</div>
	);
};

export default Loading;
