/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/html';
import type { InputType } from '@storybook/types';
import { SbbTimeInput } from './sbb-time-input';

const a = new SbbTimeInput();

const changeEventHandler = (event): void => {
  const div = document.createElement('div');
  div.innerText = `value is: ${event.target.value}; valueAsDate is: ${event.target.valueAsDate}.`;
  document.getElementById('container-value').append(div);
};

const setValueAsDate = (): void => {
  const timeInput = document.getElementsByTagName('sbb-time-input')[0];
  timeInput.valueAsDate = new Date();
};

const setValue = (): void => {
  const timeInput = document.getElementsByTagName('sbb-time-input')[0];
  timeInput.value = '0';
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Time input attribute',
  },
};

const form: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Time input attribute',
  },
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Time input attribute',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Time input attribute',
  },
};

const required: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Time input attribute',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Time input attribute',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 'l'],
  table: {
    category: 'Form-field attribute',
  },
};

const label: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const optional: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const iconStart: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const iconEnd: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const basicArgTypes: ArgTypes = {
  value,
  form,
  disabled,
  readonly,
  required,
  'aria-label': ariaLabel,
};

const formFieldBasicArgsTypes: ArgTypes = {
  ...basicArgTypes,
  label,
  size,
  optional,
  borderless,
  iconStart,
  iconEnd,
};

const basicArgs: Args = {
  value: '12:00',
  form: undefined,
  disabled: false,
  readonly: false,
  required: false,
  'aria-label': undefined,
};

const formFieldBasicArgs = {
  ...basicArgs,
  label: 'Label',
  size: size.options[0],
  optional: false,
  borderless: false,
  iconStart: undefined,
  iconEnd: undefined,
};

const formFieldBasicArgsWithIcons = {
  ...basicArgs,
  label: 'Label',
  size: size.options[0],
  optional: false,
  borderless: false,
  iconStart: 'clock-small',
  iconEnd: 'circle-information-small',
};

const TemplateSbbTimeInput = ({
  label,
  optional,
  borderless,
  iconStart,
  iconEnd,
  size,
  errorClass,
  ...args
}): JSX.Element => (
  <Fragment>
    <form target="_blank" onSubmit={(data) => console.log(data)}>
      {/* <sbb-form-field
        size={size}
        label={label}
        optional={optional}
        borderless={borderless}
        width="collapse"
      >
        {iconStart && <sbb-icon slot="prefix" name={iconStart} />} */}
        <sbb-time-input
          class={errorClass}
          {...args}
          name="time-input"
          onChange={(event) => changeEventHandler(event)}
        ></sbb-time-input>
        {/* {iconEnd && <sbb-icon slot="suffix" name={iconEnd} />}
        {errorClass && <sbb-form-error>Error</sbb-form-error>} */}
      {/* </sbb-form-field> */}
      <div style={{ display: 'flex', gap: '1em', 'margin-block-start': '2rem' }}>
        <button variant="secondary" size="m" type="button" onClick={() => setValueAsDate()}>
          Set valueAsDate to current datetime
        </button>
        <button variant="secondary" size="m" type="button" onClick={() => setValue()}>
          Set value to 0
        </button>
      </div>
      <div style={{ 'margin-block-start': '1rem' }}>Change time in input:</div>
      <div id="container-value"></div>
    </form>
  </Fragment>
);

export const TimeInput: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs },
};

export const WithIcons: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgsWithIcons },
};

export const Borderless: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    borderless: true,
  },
};

export const Disabled: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    disabled: true,
  },
};

export const Readonly: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    readonly: true,
  },
};

export const WithError: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    errorClass: 'sbb-invalid',
  },
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: ['change', 'input'],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-time-input',
};

export default meta;
