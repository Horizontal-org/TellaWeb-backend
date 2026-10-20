import type Sharp from 'sharp';

// sharp >= 0.35 ships ESM-style types (a default export) to TypeScript's node10
// module resolution, but require('sharp') is the sharp function itself, with no
// .default. Without esModuleInterop, `import sharp from 'sharp'` would compile
// to require('sharp').default and fail at runtime, so require it directly with
// the right type. Drop this once the project moves to node16 module resolution.
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const sharp: typeof Sharp = require('sharp');
