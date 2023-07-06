import type { StorybookConfig } from "@storybook/web-components-webpack5";
import Sass from 'sass';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async webpackFinal(config, { configType }) {
    
    config.module?.rules?.push({
      test: /\.scss$/,
      loader: 'lit-css-loader',
      options: {
          transform: (data, { filePath }) =>
            Sass.renderSync({ data, file: filePath }).css.toString(),
      }
    })
    
    return config;
  },
};
export default config;
