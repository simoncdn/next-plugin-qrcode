import qr from 'qrcode-terminal';
import type { Compiler } from 'webpack';
import { cyan, red } from './utils/colors';
import { getLocalIP, buildURL } from './utils/helper';
import { validatePort, validatePath } from './utils/validation';
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
		this.port = options.port ?? (Number(process.env.PORT) || DEFAULT_PORT);
		this.path = options.path ?? '';

		validatePort(this.port);
		validatePath(this.path);
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
			const ip = getLocalIP();
			if (!ip) {
				console.log(red('Error: No local IP found'));
				return;
			}
			const url = buildURL(ip, this.port, this.path);
			this.printQRCode(url);
		});
	}
}
