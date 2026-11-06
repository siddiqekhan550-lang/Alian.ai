import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const archiverPkg = require('archiver');

const rootDir = process.cwd();
const outputZipRoot = path.join(rootDir, 'Alien.ai-Complete-Website.zip');
const outputZipPublic = path.join(rootDir, 'public', 'Alien.ai-Complete-Website.zip');

export async function createCompleteZip(): Promise<string> {
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const output = fs.createWriteStream(outputZipPublic);
  const archive = new archiverPkg.ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`[ZIP Packaging] Successfully created ${archive.pointer()} total bytes.`);
      // Also copy to root directory
      try {
        fs.copyFileSync(outputZipPublic, outputZipRoot);
      } catch (e) {
        console.warn('Copying to root zip:', e);
      }
      resolve(outputZipPublic);
    });

    archive.on('error', (err: any) => {
      reject(err);
    });

    archive.pipe(output);

    const prefix = 'Alien.ai-Complete-Website/';

    // Add root documentation & configs
    archive.file(path.join(rootDir, 'package.json'), { name: prefix + 'package.json' });
    archive.file(path.join(rootDir, 'README.md'), { name: prefix + 'README.md' });
    archive.file(path.join(rootDir, 'SETUP-GUIDE.md'), { name: prefix + 'SETUP-GUIDE.md' });
    archive.file(path.join(rootDir, '.env.example'), { name: prefix + '.env.example' });
    archive.file(path.join(rootDir, '.gitignore'), { name: prefix + '.gitignore' });
    archive.file(path.join(rootDir, 'tsconfig.json'), { name: prefix + 'tsconfig.json' });
    archive.file(path.join(rootDir, 'vite.config.ts'), { name: prefix + 'vite.config.ts' });
    archive.file(path.join(rootDir, 'index.html'), { name: prefix + 'index.html' });

    // Add Frontend Directory
    if (fs.existsSync(path.join(rootDir, 'src'))) {
      archive.directory(path.join(rootDir, 'src'), prefix + 'frontend/src');
    }

    // Add Backend Directory
    if (fs.existsSync(path.join(rootDir, 'server'))) {
      archive.directory(path.join(rootDir, 'server'), prefix + 'backend');
    }
    archive.file(path.join(rootDir, 'server.ts'), { name: prefix + 'backend/server.ts' });

    // Add Tests Directory
    if (fs.existsSync(path.join(rootDir, 'tests'))) {
      archive.directory(path.join(rootDir, 'tests'), prefix + 'tests');
    }

    // Add Supabase Migrations & Policies
    if (fs.existsSync(path.join(rootDir, 'supabase'))) {
      archive.directory(path.join(rootDir, 'supabase'), prefix + 'supabase');
    }

    // Add Public assets
    if (fs.existsSync(path.join(rootDir, 'public'))) {
      archive.directory(path.join(rootDir, 'public'), prefix + 'public', (entry: any) => {
        // Exclude the generated zip from being recursively packaged inside itself
        if (entry.name && entry.name.endsWith('.zip')) return false;
        return entry;
      });
    }

    archive.finalize();
  });
}

// When executed directly via command line
if (process.argv[1]?.includes('package-project')) {
  createCompleteZip()
    .then((filePath) => console.log('Archive generated successfully at:', filePath))
    .catch((err) => console.error('Packaging failed:', err));
}
