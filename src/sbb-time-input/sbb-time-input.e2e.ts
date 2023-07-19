// import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { assert, expect, fixture, oneEvent, waitUntil } from "@open-wc/testing";
import { html } from 'lit/static-html.js';
import { SbbTimeInput } from "./sbb-time-input";
import { sendKeys } from "@web/test-runner-commands";

describe('sbb-time-input', () => {
  let element: SbbTimeInput;
  let input: HTMLInputElement;

  beforeEach(async () => {
    element = await fixture(html`
        <sbb-time-input></sbb-time-input>
    `);
    input = element.shadowRoot.querySelector('input');
  });

  it('is defined', () => {
    assert.instanceOf(element, SbbTimeInput);
  });

  it('should emit event', async () => {
    input.focus();

    await sendKeys({ type: '1' });

    setTimeout(async () => await sendKeys({ press: 'Tab' }))

    await oneEvent(element, 'change');
  });

  it('should watch for value changes', async () => {
    element.value = '11';
    
    await element.updateComplete;
    
    expect(input.value).to.be.equal('11:00');
  });

  it('should watch for value changes and interpret valid values', async () => {
    element.value = ':00';

    await element.updateComplete;

    expect(input.value).to.be.equal('00:00');
  });

  it('should watch for value changes and clear invalid values', async () => {
    element.value = ':'
    await element.updateComplete;
    expect(input.value).to.be.equal('');
  });

  it('should handle delete correctly', async () => {
    element.value = '12:00';
    await element.updateComplete;

    input.focus();
    await sendKeys({press: 'Home'})
    await sendKeys({press: 'Delete'})
    await sendKeys({press: 'Delete'})

    expect(input.value).to.be.equal(':00');

    await sendKeys({press: 'Enter'})

    expect(input.value).to.be.equal('00:00');
  });

  it('should watch for valueAsDate changes', async () => {
    element.valueAsDate = '2023-01-01T15:00:00';
    await element.updateComplete;
    expect(await input.value).to.be.equal('15:00');
  });
});
