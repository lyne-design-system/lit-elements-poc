import type { StorybookConfig } from "@storybook/web-components-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  async webpackFinal(config, { configType }) {

    config.module?.rules?.push({
      test: /global.scss$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader",
      ],
    })
    
    config.module?.rules?.push({
      test: /\.css|\.s(c|a)ss$/,
      exclude: [
        /global.scss$/,
      ],
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
