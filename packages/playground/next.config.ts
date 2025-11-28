import type { NextConfig } from "next";
import { QRCodePlugin } from "next-plugin-qrcode";

const nextConfig: NextConfig = {
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			config.plugins.push(new QRCodePlugin());
		}

		return config;
	},
};

export default nextConfig;
