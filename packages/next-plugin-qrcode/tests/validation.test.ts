import { describe, it, expect } from 'vitest';
import { validatePort, validatePath } from '../src/utils/validation';

describe('validation utils', () => {
	describe('validatePort', () => {
		it('should accept valid ports', () => {
			expect(() => validatePort(1)).not.toThrow();
			expect(() => validatePort(3000)).not.toThrow();
			expect(() => validatePort(8080)).not.toThrow();
			expect(() => validatePort(65535)).not.toThrow();
		});

		it('should reject port 0', () => {
			expect(() => validatePort(0)).toThrow('Invalid port: 0. Port must be between 1 and 65535.');
		});

		it('should reject negative ports', () => {
			expect(() => validatePort(-1)).toThrow('Invalid port: -1. Port must be between 1 and 65535.');
			expect(() => validatePort(-100)).toThrow('Invalid port: -100. Port must be between 1 and 65535.');
		});

		it('should reject ports above 65535', () => {
			expect(() => validatePort(65536)).toThrow('Invalid port: 65536. Port must be between 1 and 65535.');
			expect(() => validatePort(100000)).toThrow('Invalid port: 100000. Port must be between 1 and 65535.');
		});

		it('should reject non-integer ports', () => {
			expect(() => validatePort(3000.5)).toThrow('Invalid port: 3000.5. Port must be an integer.');
			expect(() => validatePort(NaN)).toThrow('Invalid port: NaN. Port must be an integer.');
		});
	});

	describe('validatePath', () => {
		it('should accept valid string paths', () => {
			expect(() => validatePath('')).not.toThrow();
			expect(() => validatePath('/')).not.toThrow();
			expect(() => validatePath('/admin')).not.toThrow();
			expect(() => validatePath('dashboard')).not.toThrow();
			expect(() => validatePath('/api/v1/users')).not.toThrow();
		});

		it('should reject non-string paths', () => {
			expect(() => validatePath(123 as any)).toThrow('Invalid path: 123. Path must be a string.');
			expect(() => validatePath(null as any)).toThrow('Invalid path: null. Path must be a string.');
			expect(() => validatePath(undefined as any)).toThrow('Invalid path: undefined. Path must be a string.');
			expect(() => validatePath({} as any)).toThrow('Invalid path: [object Object]. Path must be a string.');
		});
	});
});
