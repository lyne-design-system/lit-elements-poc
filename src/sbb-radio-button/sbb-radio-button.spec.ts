import { expect, fixture } from '@open-wc/testing';
import { SbbRadioButton } from './sbb-radio-button';
import { html } from 'lit/static-html.js';

describe('sbb-radio-button', () => {
  let element: SbbRadioButton;

  beforeEach(async () => {
    element = await fixture(html`<sbb-radio-button></sbb-radio-button>`);
  });

  it('is defined', () => {
    expect(element).instanceOf(SbbRadioButton);
  });

  it('renders', async () => {
    expect(element).dom.to.be.equal(
      `<sbb-radio-button aria-checked="false" aria-disabled="false" aria-required="false" size="m" role="radio">`
    )
    expect(element).shadowDom.to.be.equal(
      `<label class="sbb-radio-button">
        <input aria-hidden="true" class="sbb-radio-button__input" tabindex="-1" type="radio">
        <span class="sbb-radio-button__label-slot">
        <slot></slot>
        </span>
      </label>`
    )
  });
});
