import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { SbbRadioButtonGroup } from './sbb-radio-button-group';

describe('sbb-radio-button-group', () => {
  let element: SbbRadioButtonGroup;

  beforeEach(async () => {
    element = await fixture(html`<sbb-radio-button-group/>`);
  });

  it('is defined', () => {
    expect(element).instanceOf(SbbRadioButtonGroup);
  });

  it('renders', async () => {

    // TODO Same problem as RadioButton spec. Analyze the decorator problem

    expect(element).dom.to.be.equal(`<sbb-radio-button-group orientation="horizontal" role="radiogroup"></sbb-radio-button-group>`);

    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-radio-group">
        <slot></slot>
      </div>`
    )
  });
});
