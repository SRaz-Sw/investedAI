/** @type {import('next').NextConfig} */
const clarityId =
	process.env.NEXT_PUBLIC_CLARITY_ID ||
	process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ||
	process.env.CLARITY_ID ||
	process.env.CLIENT_KEY_CLARITY_ID ||
	process.env.CLIENT_KEY_NEXT_PUBLIC_CLARITY_ID ||
	'';

if (process.env.NODE_ENV === 'production' && !clarityId) {
	// This will show in Vercel build logs to pinpoint missing envs
	console.warn(
		'Microsoft Clarity: No Clarity ID found at build time. ' +
			'Set NEXT_PUBLIC_CLARITY_ID (or CLARITY_ID) in Vercel env vars.'
	);
}

const nextConfig = {
	env: {
		// Ensure a single, public key is always inlined for the client bundle.
		NEXT_PUBLIC_CLARITY_ID: clarityId,
	},
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
