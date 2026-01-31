/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	// images: { unoptimized: true },
	// Enable SPA-like behavior for static exports
	trailingSlash: true,
	// Optimize production builds
	compiler: {
		// Temporarily disabled to debug Clarity integration
		// removeConsole: process.env.NODE_ENV === 'production',
	},
};

module.exports = nextConfig;
