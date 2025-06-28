import { build } from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);

async function getAllTSFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getAllTSFiles(res) : res;
  }));
  return files.flat().filter(f => f.endsWith('.ts'));
}

const fixImportsPlugin = {
  name: 'fix-imports-extensions',
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      let source = await fs.readFile(args.path, 'utf8');
      let changed = false;

      const importExportRegex = /((?:import|export)[^'"]*?['"])(\.\/|\.\.\/[^'"]*?)([^'"]*?)(['"])/g;

      source = source.replace(importExportRegex, (match, prefix, relPathStart, relPathRest, suffix) => {
        const fullPath = relPathStart + relPathRest;

        if (fullPath.endsWith('/')) {
          return match;
        }
        if (/\.[a-z0-9]+$/i.test(fullPath)) {
          if (fullPath.endsWith('.ts')) {
            changed = true;
            console.log(`[fix-imports] ${args.path} - Troca ${fullPath} → ${fullPath.slice(0, -3)}.js`);
            return prefix + fullPath.slice(0, -3) + '.js' + suffix;
          }
          return match;
        }
        return prefix + fullPath + '.js' + suffix;
      });
      return { contents: source, loader: 'ts' };
    });
  },
};


(async () => {
  console.log('🔧 Gerando Prisma Client...');
  await exec('npx prisma generate');

  console.log('🚀 Compilando com esbuild...');
  const entryPoints = await getAllTSFiles('src');

  await build({
    entryPoints,
    bundle: false,
    outdir: 'dist',
    platform: 'node',
    format: 'esm',
    target: ['node20'],
    plugins: [fixImportsPlugin],
  });

  console.log('Build concluído!');
})();
