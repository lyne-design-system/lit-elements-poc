/** @jsx h */
import type { Meta, StoryObj } from '@storybook/web-components';
import { MyElement } from './sbb-element';
import { html } from 'lit';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'Example/sbb-element',
  tags: ['autodocs'],
  //render: (args) => html`<div style="height: 50px; border: 1px solid;"></div><my-element></my-element>`,
  render: (args) => new MyElement(),
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<any>;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
