/**
 * Wraps a string with cyan ANSI color codes
 */
export function cyan(str: string): string {
	return `\x1b[36m${str}\x1b[0m`;
}

/**
 * Wraps a string with red ANSI color codes
 */
export function red(str: string): string {
	return `\x1b[31m${str}\x1b[0m`;
}
