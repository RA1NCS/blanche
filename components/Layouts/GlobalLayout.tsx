'use client';

import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { usePathname } from 'next/navigation';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const startLoading = () => {
			setLoading(true);
			timeoutId = setTimeout(() => {
				setLoading(false);
			}, 1000);
		};

		startLoading();

		return () => {
			clearTimeout(timeoutId);
		};
	}, [pathname]);

	return loading ? <Loading /> : <>{children}</>;
}
