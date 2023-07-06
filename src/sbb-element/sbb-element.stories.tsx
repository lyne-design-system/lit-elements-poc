/** @jsx h */
import type { Meta, StoryObj } from '@storybook/web-components';
import { MyElement } from './sbb-element';
import { html } from 'lit';

/**
 *  Not sure why, but this is necessary (probably without a reference to "MyElement" the component is stripped by the compiler)
 */
const a = new MyElement();
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

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'Example/sbb-element',
  tags: ['autodocs'],
  render: (args) => html`<my-element></my-element>`,
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