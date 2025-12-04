import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'scss') {
        await copyDirectory(srcPath, destPath);
      }
    } else {
      if (!entry.name.endsWith('.scss')) {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

async function build() {
  try {
    console.log('Building project for GitHub Pages...');

    await fs.rm(distDir, { recursive: true, force: true });
    await fs.mkdir(distDir, { recursive: true });

    const filesToCopy = [
      { src: path.join(srcDir, 'index.html'), dest: path.join(distDir, 'index.html') },
    ];

    for (const { src, dest } of filesToCopy) {
      try {
        await fs.copyFile(src, dest);
        console.log(`Copied: ${path.relative(process.cwd(), src)}`);
      } catch (err) {
        console.log(`Skipped: ${path.relative(process.cwd(), src)} (not found)`);
      }
    }

    const dirsToCopy = [
      { src: path.join(srcDir, 'html'), dest: path.join(distDir, 'html') },
      { src: path.join(srcDir, 'js'), dest: path.join(distDir, 'js') },
      { src: path.join(srcDir, 'assets'), dest: path.join(distDir, 'assets') },
    ];

    for (const { src, dest } of dirsToCopy) {
      try {
        await copyDirectory(src, dest);
        console.log(`Copied directory: ${path.relative(process.cwd(), src)}`);
      } catch (err) {
        console.log(`Skipped directory: ${path.relative(process.cwd(), src)} (not found)`);
      }
    }

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
