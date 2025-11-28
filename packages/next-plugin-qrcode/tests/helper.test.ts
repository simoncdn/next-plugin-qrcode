import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import os from 'os';
import { getLocalIP, buildURL } from '../src/utils/helper';

describe('network utils', () => {
	describe('getLocalIP', () => {
		beforeEach(() => {
			vi.restoreAllMocks();
		});

		it('should return the first non-internal IPv4 address', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({
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

			const ip = getLocalIP();
			expect(ip).toBe('192.168.1.100');
		});

		it('should skip internal addresses (localhost)', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({
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

			const ip = getLocalIP();
			expect(ip).toBe('192.168.1.50');
		});

		it('should skip IPv6 addresses', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({
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

			const ip = getLocalIP();
			expect(ip).toBe('192.168.1.75');
		});

		it('should return null if no valid IP is found', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({
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

			const ip = getLocalIP();
			expect(ip).toBeNull();
		});

		it('should handle empty network interfaces', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({});

			const ip = getLocalIP();
			expect(ip).toBeNull();
		});

		it('should handle undefined interface entries', () => {
			vi.spyOn(os, 'networkInterfaces').mockReturnValue({
				eth0: undefined,
			});

			const ip = getLocalIP();
			expect(ip).toBeNull();
		});
	});

	describe('buildURL', () => {
		it('should build URL with IP and port', () => {
			const url = buildURL('192.168.1.100', 3000, '');
			expect(url).toBe('http://192.168.1.100:3000');
		});

		it('should build URL with path starting with slash', () => {
			const url = buildURL('192.168.1.100', 3000, '/dashboard');
			expect(url).toBe('http://192.168.1.100:3000/dashboard');
		});

		it('should build URL with path not starting with slash', () => {
			const url = buildURL('192.168.1.100', 3000, 'admin');
			expect(url).toBe('http://192.168.1.100:3000/admin');
		});

		it('should handle empty path', () => {
			const url = buildURL('192.168.1.100', 3000, '');
			expect(url).toBe('http://192.168.1.100:3000');
		});

		it('should handle custom ports', () => {
			const url = buildURL('10.0.0.5', 8080, '/api');
			expect(url).toBe('http://10.0.0.5:8080/api');
		});

		it('should handle complex paths', () => {
			const url = buildURL('192.168.1.100', 3000, '/admin/dashboard');
			expect(url).toBe('http://192.168.1.100:3000/admin/dashboard');
		});
	});
});
