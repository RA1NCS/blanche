'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NavItemProps {
	href: string;
	icon: ReactNode;
	label: string;
}

export default function NavItem({ href, icon, label }: NavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={`relative flex flex-row items-center h-11 focus:outline-none ${
				isActive
					? 'bg-blue-100 text-blue-800'
					: 'text-gray-600 hover:bg-blue-200 hover:text-gray-800'
			} rounded-lg w-full pr-6 pl-4 transition duration-300`}
		>
			<span className="inline-flex justify-center items-center">
				{icon}
			</span>
			<span className="ml-2 text-sm tracking-wide truncate">
				{label}
			</span>
		</Link>
	);
}
