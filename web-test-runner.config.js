import { esbuildPlugin } from '@web/dev-server-esbuild';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { fileURLToPath } from 'url';

const mode = process.env.MODE || 'dev';

export default {
  rootDir: '.',
  files: ['dist/tsc/**/*.spec.js', 'dist/tsc/**/*.e2e.js', '!dist/tsc/global/**/*.js'], // the global folder is temporary excluded until we migrate test
  groups: [
    {name: 'spec', files: ['dist/tsc/**/*.spec.js', '!dist/tsc/global/**/*.js']},
    {name: 'e2e', files: ['dist/tsc/**/*.e2e.js', '!dist/tsc/global/**/*.js']}
  ],
  nodeResolve: true,
  reporters: [
    defaultReporter(),
    summaryReporter()
  ],
  browsers: [puppeteerLauncher({ concurrency: 1, launchOptions: { headless: false, devtools: true } })], // Set headless to false to use the debugger
  plugins: [
    
    // esbuildPlugin({ 
    //   ts: true, 
    //   tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    // }),
  ],
};