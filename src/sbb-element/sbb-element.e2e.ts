import { assert, expect, fixture, oneEvent, waitUntil } from "@open-wc/testing";
import { setViewport } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';
import { MyElement } from "./sbb-element";


describe('sbb-toast', () => {
  let element: MyElement;

  beforeEach(async () => {
    element = await fixture(html`<my-element></my-element>`);
  });

  it('is defined', () => {
    assert.instanceOf(element, MyElement);
  });

  it('renders and sets the correct attributes', async () => {
    expect(element).not.to.have.attribute('data-has-action');
    expect(element).has.attribute('data-state', 'initial');
  });

  it('display the prop', async () => {
    element.property = 'goofy';

    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.prop-display').textContent).to.be.equal('Prop: goofy');
  });

  it('works on 400x800', async () => {
    await setViewport({ width: 400, height: 800 });
    expect(true).to.be.true;
  });

  it('Wait until', async () => {
    await waitUntil(() => true, 'Similar to waitForCondition() we have');
    expect(true).to.be.true;
  })

  it('Wait for events', async () => {
    const btn = element.shadowRoot.querySelector('button');
    setTimeout(() => btn.click());

    await oneEvent(element, 'count-changed');
    expect(true).to.be.true;
  })
});
