import type { StorybookConfig } from "@storybook/web-components-webpack5";

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
      test: /\.css|\.s(c|a)ss$/,
      use: [{
          loader: 'lit-scss-loader',
          options: {
              minify: true,
          },
      }, 'extract-loader', 'css-loader', 'sass-loader'],
    })
    
    return config;
  },
};
export default config;
