import { assert, expect, fixture, oneEvent, waitUntil } from "@open-wc/testing";
import { html } from 'lit/static-html.js';
import events from './sbb-radio-button.events';
import { SbbRadioButton } from "./sbb-radio-button";

describe('sbb-radio-button', () => {
    let element: SbbRadioButton;

  beforeEach(async () => {
    element = await fixture(html`<sbb-radio-button/>`);
  });

  it('is defined', () => {
    assert.instanceOf(element, SbbRadioButton);
  });

  it('selects radio on click', async () => {
    setTimeout(() => element.click());

    await oneEvent(element, events.stateChange);

    expect(element).to.have.attribute('checked');
  });

  it('does not deselect radio if already checked', async () => {
    element.select();
    await element.updateComplete;

    element.addEventListener(events.stateChange, () => {throw new Error("state-change event should not be emitted")});
    element.click();
    await element.updateComplete;
    expect(element).to.have.attribute('checked');
  });

  it('allows empty selection', async () => {
    element.allowEmptySelection = true;
    await element.updateComplete;

    element.click();
    await element.updateComplete;
    expect(element).to.have.attribute('checked');

    setTimeout(() => element.click());

    await oneEvent(element, events.stateChange);
    await element.updateComplete;
    expect(element).not.to.have.attribute('checked');
  });
});
