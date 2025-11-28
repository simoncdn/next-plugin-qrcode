"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const os_1 = __importDefault(require("os"));
const helper_1 = require("../src/utils/helper");
(0, vitest_1.describe)('network utils', () => {
    (0, vitest_1.describe)('getLocalIP', () => {
        (0, vitest_1.beforeEach)(() => {
            vitest_1.vi.restoreAllMocks();
        });
        (0, vitest_1.it)('should return the first non-internal IPv4 address', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({
                eth0: [
                    {
                        address: '192.168.1.100',
                        netmask: '255.255.255.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '192.168.1.100/24',
                    },
                ],
            });
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBe('192.168.1.100');
        });
        (0, vitest_1.it)('should skip internal addresses (localhost)', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({
                lo: [
                    {
                        address: '127.0.0.1',
                        netmask: '255.0.0.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '127.0.0.1/8',
                    },
                ],
                eth0: [
                    {
                        address: '192.168.1.50',
                        netmask: '255.255.255.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '192.168.1.50/24',
                    },
                ],
            });
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBe('192.168.1.50');
        });
        (0, vitest_1.it)('should skip IPv6 addresses', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({
                eth0: [
                    {
                        address: 'fe80::1',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: 'fe80::1/64',
                        scopeid: 1,
                    },
                    {
                        address: '192.168.1.75',
                        netmask: '255.255.255.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '192.168.1.75/24',
                    },
                ],
            });
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBe('192.168.1.75');
        });
        (0, vitest_1.it)('should return null if no valid IP is found', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({
                lo: [
                    {
                        address: '127.0.0.1',
                        netmask: '255.0.0.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '127.0.0.1/8',
                    },
                ],
            });
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBeNull();
        });
        (0, vitest_1.it)('should handle empty network interfaces', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({});
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBeNull();
        });
        (0, vitest_1.it)('should handle undefined interface entries', () => {
            vitest_1.vi.spyOn(os_1.default, 'networkInterfaces').mockReturnValue({
                eth0: undefined,
            });
            const ip = (0, helper_1.getLocalIP)();
            (0, vitest_1.expect)(ip).toBeNull();
        });
    });
    (0, vitest_1.describe)('buildURL', () => {
        (0, vitest_1.it)('should build URL with IP and port', () => {
            const url = (0, helper_1.buildURL)('192.168.1.100', 3000, '');
            (0, vitest_1.expect)(url).toBe('http://192.168.1.100:3000');
        });
        (0, vitest_1.it)('should build URL with path starting with slash', () => {
            const url = (0, helper_1.buildURL)('192.168.1.100', 3000, '/dashboard');
            (0, vitest_1.expect)(url).toBe('http://192.168.1.100:3000/dashboard');
        });
        (0, vitest_1.it)('should build URL with path not starting with slash', () => {
            const url = (0, helper_1.buildURL)('192.168.1.100', 3000, 'admin');
            (0, vitest_1.expect)(url).toBe('http://192.168.1.100:3000/admin');
        });
        (0, vitest_1.it)('should handle empty path', () => {
            const url = (0, helper_1.buildURL)('192.168.1.100', 3000, '');
            (0, vitest_1.expect)(url).toBe('http://192.168.1.100:3000');
        });
        (0, vitest_1.it)('should handle custom ports', () => {
            const url = (0, helper_1.buildURL)('10.0.0.5', 8080, '/api');
            (0, vitest_1.expect)(url).toBe('http://10.0.0.5:8080/api');
        });
        (0, vitest_1.it)('should handle complex paths', () => {
            const url = (0, helper_1.buildURL)('192.168.1.100', 3000, '/admin/dashboard');
            (0, vitest_1.expect)(url).toBe('http://192.168.1.100:3000/admin/dashboard');
        });
    });
});
