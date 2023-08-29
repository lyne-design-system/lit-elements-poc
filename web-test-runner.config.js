import { esbuildPlugin } from '@web/dev-server-esbuild';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { fileURLToPath } from 'url';

const mode = process.env.MODE || 'dev';

export default {
  rootDir: 'dist/lyne-components',
  files: ['dist/lyne-components/**/*.spec.js', 'dist/lyne-components/**/*.e2e.js', '!dist/lyne-components/global/**/*.js'], // the global folder is temporary excluded until we migrate test
  groups: [
    {name: 'spec', files: ['dist/lyne-components/**/*.spec.js', '!dist/lyne-components/global/**/*.js']},
    {name: 'e2e', files: ['dist/lyne-components/**/*.e2e.js', '!dist/lyne-components/global/**/*.js']}
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