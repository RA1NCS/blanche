import { ReactNode } from 'react';

interface NavSectionProps {
	children: ReactNode;
}

export default function NavSection({ children }: NavSectionProps) {
	return <ul className="space-y-4">{children}</ul>;
}
