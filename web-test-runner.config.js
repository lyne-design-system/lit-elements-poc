import { esbuildPlugin } from '@web/dev-server-esbuild';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';

const mode = process.env.MODE || 'dev';

export default {
  rootDir: '.',
  files: ['src/**/*.spec.ts', 'src/**/*.e2e.ts', '!src/global/**/*.ts'],
  groups: [
    {name: 'spec', files: ['src/**/*.spec.ts', '!src/global/**/*.ts']},
    {name: 'e2e', files: ['src/**/*.e2e.ts', '!src/global/**/*.ts']}
  ],
  nodeResolve: true,
  reporters: [
    defaultReporter(),
    summaryReporter()
  ],
  browsers: [puppeteerLauncher({ concurrency: 1 })],
  plugins: [esbuildPlugin({ ts: true })],
};