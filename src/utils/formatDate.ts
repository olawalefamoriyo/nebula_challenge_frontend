export const formatTimestamp = (timestamp: number | string | null | undefined): string => {
	if (!timestamp || isNaN(Number(timestamp))) return 'N/A';
	const date = new Date(Number(timestamp));
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
};
