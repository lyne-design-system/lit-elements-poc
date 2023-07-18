
import { MyElement } from './sbb-element';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

describe('sbb-element', () => {
  let element: MyElement;

  beforeEach(async () => {
    element = await fixture(html`<my-element></my-element>`);
  });

  it('is defined', () => {
    expect(element).instanceOf(MyElement);
  });

  it('renders', async () => {
    expect(element).dom.equal(
      `<my-element data-state="initial"></my-element>`
    )

    expect(element).shadowDom.equal(
    `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <div class="prop-display">Prop: </div>
      <slot></slot>
    `
    );
  });
  
  // Automatically saves HTML snapshots
  it('renders check with snapshot - lightDOM', async () => {
    await expect(element).dom.equalSnapshot();
  });

  it('renders check with snapshot - shadowDOM', async () => {
    await expect(element).shadowDom.equalSnapshot();
  });
});
