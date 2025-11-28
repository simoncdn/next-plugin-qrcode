"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validation_1 = require("../src/utils/validation");
(0, vitest_1.describe)('validation utils', () => {
    (0, vitest_1.describe)('validatePort', () => {
        (0, vitest_1.it)('should accept valid ports', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(1)).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(3000)).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(8080)).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(65535)).not.toThrow();
        });
        (0, vitest_1.it)('should reject port 0', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(0)).toThrow('Invalid port: 0. Port must be between 1 and 65535.');
        });
        (0, vitest_1.it)('should reject negative ports', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(-1)).toThrow('Invalid port: -1. Port must be between 1 and 65535.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(-100)).toThrow('Invalid port: -100. Port must be between 1 and 65535.');
        });
        (0, vitest_1.it)('should reject ports above 65535', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(65536)).toThrow('Invalid port: 65536. Port must be between 1 and 65535.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(100000)).toThrow('Invalid port: 100000. Port must be between 1 and 65535.');
        });
        (0, vitest_1.it)('should reject non-integer ports', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(3000.5)).toThrow('Invalid port: 3000.5. Port must be an integer.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePort)(NaN)).toThrow('Invalid port: NaN. Port must be an integer.');
        });
    });
    (0, vitest_1.describe)('validatePath', () => {
        (0, vitest_1.it)('should accept valid string paths', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)('')).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)('/')).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)('/admin')).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)('dashboard')).not.toThrow();
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)('/api/v1/users')).not.toThrow();
        });
        (0, vitest_1.it)('should reject non-string paths', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)(123)).toThrow('Invalid path: 123. Path must be a string.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)(null)).toThrow('Invalid path: null. Path must be a string.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)(undefined)).toThrow('Invalid path: undefined. Path must be a string.');
            (0, vitest_1.expect)(() => (0, validation_1.validatePath)({})).toThrow('Invalid path: [object Object]. Path must be a string.');
        });
    });
});
