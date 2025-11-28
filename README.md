# next-plugin-qrcode

Show QR code on Next.js dev server start.

> Inspired by [vite-plugin-qrcode](https://github.com/svitejs/vite-plugin-qrcode) for Vite.

## Installation

```bash
npm install --save-dev next-plugin-qrcode
```

## Usage

Add the plugin to your `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import { QRCodePlugin } from "next-plugin-qrcode";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // only applies in dev mode
    if (dev && !isServer) {
      config.plugins.push(new QRCodePlugin());
    }
    return config;
  },
};

export default nextConfig;
```

Start your dev server:

```bash
npm run dev
```

The QR code will be displayed in your terminal. Scan it with your mobile device to quickly access your Next.js app on the local network.

## Configuration

You can pass options to customize the behavior:

```typescript
new QRCodePlugin({
  port: 3000,  // custom port (default: process.env.PORT or 3000)
  path: ''     // custom path (default: '')
})
```

### Example with custom path

```typescript
config.plugins.push(
  new QRCodePlugin({
    port: 3001,
    path: '/admin'
  })
);
```

## Packages

| Package | Version | Changelog |
| --- | --- | --- |
| next-plugin-qrcode | 0.0.1 | [Changelog](./packages/next-plugin-qrcode/CHANGELOG.md) |

## Development

Commands for maintainers:

```bash
pnpm install
pnpm build
pnpm playground
```

## License

[MIT](./LICENSE)
