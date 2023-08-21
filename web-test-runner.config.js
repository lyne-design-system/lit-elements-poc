import { esbuildPlugin } from '@web/dev-server-esbuild';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { fileURLToPath } from 'url';

const mode = process.env.MODE || 'dev';

export default {
  rootDir: '.',
  files: ['src/**/*.spec.ts', 'src/**/*.e2e.ts', '!src/global/**/*.ts'], // the global folder is temporary excluded until we migrate test
  groups: [
    {name: 'spec', files: ['src/**/*.spec.ts', '!src/global/**/*.ts']},
    {name: 'e2e', files: ['src/**/*.e2e.ts', '!src/global/**/*.ts']}
  ],
  nodeResolve: true,
  reporters: [
    defaultReporter(),
    summaryReporter()
  ],
  browsers: [puppeteerLauncher({ concurrency: 1, launchOptions: { headless: 'new', devtools: true } })], // Set headless to false to use the debugger
  plugins: [
    
    esbuildPlugin({ 
      ts: true, 
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    }),
  ],
};