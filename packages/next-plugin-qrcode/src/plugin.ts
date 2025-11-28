import qr from 'qrcode-terminal';
import os from 'os';
import type { Compiler } from 'webpack';
import { cyan, red } from './utils/colors';
import { QRCodePluginOptions } from './type';

const DEFAULT_PORT = 3000;

/**
 * Webpack plugin that displays a QR code in the terminal
 * when the Next.js dev server starts.
 *
 * @example
 * ```ts
 * // next.config.js
 * const { QRCodePlugin } = require('next-plugin-qrcode');
 *
 * module.exports = {
 *   webpack: (config, { dev, isServer }) => {
 *     if (dev && !isServer) {
 *       config.plugins.push(new QRCodePlugin({ port: 3000 }));
 *     }
 *     return config;
 *   },
 * };
 * ```
 */
export class QRCodePlugin {
	private port: number;
	private path: string;

	/**
	 * @param options - Plugin configuration options
	 */
	constructor(options: QRCodePluginOptions = {}) {
		this.port = options.port || Number(process.env.PORT) || DEFAULT_PORT;
		this.path = options.path || '';
	}

	private getLocalIP(): string | null {
		const interfaces = os.networkInterfaces();
		for (const name of Object.keys(interfaces)) {
			for (const iface of interfaces[name] ?? []) {
				if (iface.family === 'IPv4' && !iface.internal) {
					return iface.address;
				}
			}
		}
		return null;
	}

	private getURL(ip: string): string {
		const path = this.path.startsWith('/') ? this.path : `/${this.path}`;
		return `http://${ip}:${this.port}${this.path ? path : ''}`;
	}

	private printQRCode(url: string): void {
		console.log('Visit page on mobile:');
		console.log(cyan(url));
		qr.generate(url, { small: true });
		console.log('');
	}

	/**
	 * Webpack plugin apply method
	 * @param compiler - Webpack compiler instance
	 */
	apply(compiler: Compiler): void {
		compiler.hooks.environment.tap('QRCodePlugin', () => {
			const ip = this.getLocalIP();
			if (!ip) {
				console.log(red('Error: No local IP found'));
				return;
			}
			const url = this.getURL(ip);
			this.printQRCode(url);
		});
	}
}
