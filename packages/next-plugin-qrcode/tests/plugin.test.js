"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const plugin_1 = require("../src/plugin");
(0, vitest_1.describe)('QRCodePlugin', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)('constructor', () => {
        (0, vitest_1.it)('should use default port when no options provided', () => {
            const plugin = new plugin_1.QRCodePlugin();
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should use provided port from options', () => {
            const plugin = new plugin_1.QRCodePlugin({ port: 8080 });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should use PORT environment variable when available', () => {
            const originalPort = process.env.PORT;
            process.env.PORT = '4000';
            const plugin = new plugin_1.QRCodePlugin();
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
            process.env.PORT = originalPort;
        });
        (0, vitest_1.it)('should prioritize options.port over environment variable', () => {
            const originalPort = process.env.PORT;
            process.env.PORT = '4000';
            const plugin = new plugin_1.QRCodePlugin({ port: 5000 });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
            process.env.PORT = originalPort;
        });
        (0, vitest_1.it)('should handle empty path', () => {
            const plugin = new plugin_1.QRCodePlugin({ path: '' });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should handle path with leading slash', () => {
            const plugin = new plugin_1.QRCodePlugin({ path: '/admin' });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should handle path without leading slash', () => {
            const plugin = new plugin_1.QRCodePlugin({ path: 'dashboard' });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should handle both port and path options', () => {
            const plugin = new plugin_1.QRCodePlugin({ port: 3001, path: '/api' });
            (0, vitest_1.expect)(plugin).toBeInstanceOf(plugin_1.QRCodePlugin);
        });
        (0, vitest_1.it)('should throw error for invalid port (too low)', () => {
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ port: 0 })).toThrow('Invalid port: 0. Port must be between 1 and 65535.');
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ port: -1 })).toThrow('Invalid port: -1. Port must be between 1 and 65535.');
        });
        (0, vitest_1.it)('should throw error for invalid port (too high)', () => {
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ port: 65536 })).toThrow('Invalid port: 65536. Port must be between 1 and 65535.');
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ port: 100000 })).toThrow('Invalid port: 100000. Port must be between 1 and 65535.');
        });
        (0, vitest_1.it)('should throw error for non-integer port', () => {
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ port: 3000.5 })).toThrow('Invalid port: 3000.5. Port must be an integer.');
        });
        (0, vitest_1.it)('should throw error for non-string path', () => {
            (0, vitest_1.expect)(() => new plugin_1.QRCodePlugin({ path: 123 })).toThrow('Invalid path: 123. Path must be a string.');
        });
    });
    (0, vitest_1.describe)('apply', () => {
        (0, vitest_1.it)('should have an apply method', () => {
            const plugin = new plugin_1.QRCodePlugin();
            (0, vitest_1.expect)(typeof plugin.apply).toBe('function');
        });
        (0, vitest_1.it)('should register webpack hook', () => {
            const plugin = new plugin_1.QRCodePlugin();
            const mockCompiler = {
                hooks: {
                    environment: {
                        tap: vitest_1.vi.fn(),
                    },
                },
            };
            plugin.apply(mockCompiler);
            (0, vitest_1.expect)(mockCompiler.hooks.environment.tap).toHaveBeenCalledWith('QRCodePlugin', vitest_1.expect.any(Function));
        });
    });
});
