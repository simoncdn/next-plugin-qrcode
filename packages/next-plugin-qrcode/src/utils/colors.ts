export function cyan(str: string): string {
	return `\x1b[36m${str}\x1b[0m`;
}

export function red(str: string): string {
	return `\x1b[31m${str}\x1b[0m`;
}
