import { copyFileSync, writeFileSync } from 'fs';
import pack from './package.json';

pack.name = 'v9scjs';
pack.type = 'commonjs';
pack.main = 'lib/index.js';
pack.types = 'lib/index.d.ts';
delete pack.scripts;
delete pack.devDependencies;

writeFileSync('v9scjs/package.json', JSON.stringify(pack, undefined, 2));
copyFileSync('README.md', 'v9scjs/README.md');
copyFileSync('LICENSE', 'v9scjs/LICENSE');
