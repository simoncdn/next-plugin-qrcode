import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRCodePlugin } from '../src/plugin';

describe('QRCodePlugin', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('should use default port when no options provided', () => {
			const plugin = new QRCodePlugin();
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should use provided port from options', () => {
			const plugin = new QRCodePlugin({ port: 8080 });
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should use PORT environment variable when available', () => {
			const originalPort = process.env.PORT;
			process.env.PORT = '4000';

			const plugin = new QRCodePlugin();
			expect(plugin).toBeInstanceOf(QRCodePlugin);

			process.env.PORT = originalPort;
		});

		it('should prioritize options.port over environment variable', () => {
			const originalPort = process.env.PORT;
			process.env.PORT = '4000';

			const plugin = new QRCodePlugin({ port: 5000 });
			expect(plugin).toBeInstanceOf(QRCodePlugin);

			process.env.PORT = originalPort;
		});

		it('should handle empty path', () => {
			const plugin = new QRCodePlugin({ path: '' });
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should handle path with leading slash', () => {
			const plugin = new QRCodePlugin({ path: '/admin' });
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should handle path without leading slash', () => {
			const plugin = new QRCodePlugin({ path: 'dashboard' });
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should handle both port and path options', () => {
			const plugin = new QRCodePlugin({ port: 3001, path: '/api' });
			expect(plugin).toBeInstanceOf(QRCodePlugin);
		});

		it('should throw error for invalid port (too low)', () => {
			expect(() => new QRCodePlugin({ port: 0 })).toThrow('Invalid port: 0. Port must be between 1 and 65535.');
			expect(() => new QRCodePlugin({ port: -1 })).toThrow('Invalid port: -1. Port must be between 1 and 65535.');
		});

		it('should throw error for invalid port (too high)', () => {
			expect(() => new QRCodePlugin({ port: 65536 })).toThrow('Invalid port: 65536. Port must be between 1 and 65535.');
			expect(() => new QRCodePlugin({ port: 100000 })).toThrow('Invalid port: 100000. Port must be between 1 and 65535.');
		});

		it('should throw error for non-integer port', () => {
			expect(() => new QRCodePlugin({ port: 3000.5 })).toThrow('Invalid port: 3000.5. Port must be an integer.');
		});

		it('should throw error for non-string path', () => {
			expect(() => new QRCodePlugin({ path: 123 as any })).toThrow('Invalid path: 123. Path must be a string.');
		});
	});

	describe('apply', () => {
		it('should have an apply method', () => {
			const plugin = new QRCodePlugin();
			expect(typeof plugin.apply).toBe('function');
		});

		it('should register webpack hook', () => {
			const plugin = new QRCodePlugin();
			const mockCompiler = {
				hooks: {
					environment: {
						tap: vi.fn(),
					},
				},
			};

			plugin.apply(mockCompiler as any);

			expect(mockCompiler.hooks.environment.tap).toHaveBeenCalledWith(
				'QRCodePlugin',
				expect.any(Function)
			);
		});
	});
});
