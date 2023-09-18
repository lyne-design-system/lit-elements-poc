import type { StorybookConfig } from "@storybook/web-components-vite";
import { mergeConfig } from 'vite';
import { plugins } from '../vite.config';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      assetsInclude: ['**/*.md'],
      plugins: [plugins]
    })
  },
};
export default config;
