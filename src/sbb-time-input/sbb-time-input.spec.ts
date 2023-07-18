import { expect, fixture } from '@open-wc/testing';
import { SbbTimeInput } from './sbb-time-input';
import { html } from 'lit/static-html.js';

describe('sbb-time-input', () => {
  let element: SbbTimeInput;

  beforeEach(async () => {
    element = await fixture(html`<sbb-time-input></sbb-time-input>`);
  });

  it('is defined', () => {
    expect(element).instanceOf(SbbTimeInput);
  });

  it('renders', async () => {

    expect(element).dom.to.be.equal(
      `<sbb-time-input aria-disabled="false" aria-readonly="false" aria-required="false" role="input">`
    )
    expect(element).shadowDom.to.be.equal(
      `<input placeholder="HH:MM" role="presentation" type="text">`
    )
  });

  // it('renders readonly', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SbbTimeInput],
  //     html: '<sbb-time-input readonly="true"/>',
  //   });

  //   expect(root).toEqualHtml(`
  //     <sbb-time-input aria-disabled="false" aria-readonly="true" aria-required="false" readonly="true" role="input">
  //       <mock:shadow-root>
  //         <input placeholder="HH:MM" type="text" role="presentation" readonly="">
  //       </mock:shadow-root>
  //     </sbb-time-input>
  //   `);
  // });

  // it('renders required with value', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SbbTimeInput],
  //     html: '<sbb-time-input required="true" value="1200"/>',
  //   });

  //   expect(root).toEqualHtml(`
  //     <sbb-time-input aria-disabled="false" aria-readonly="false" aria-required="true" required="true" role="input" value="1200">
  //       <mock:shadow-root>
  //         <input placeholder="HH:MM" type="text" required="" role="presentation" value="12:00">
  //       </mock:shadow-root>
  //     </sbb-time-input>
  //   `);
  // });

  // it('renders disabled with value and form', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SbbTimeInput],
  //     html: '<sbb-time-input disabled="true" value="123" form="myForm"/>',
  //   });

  //   expect(root).toEqualHtml(`
  //     <sbb-time-input role="input" aria-disabled="true" aria-readonly="false" aria-required="false" disabled="" value="123" form="myForm">
  //       <mock:shadow-root>
  //         <input placeholder="HH:MM" type="text" disabled="" value="01:23" role="presentation">
  //       </mock:shadow-root>
  //     </sbb-time-input>
  //   `);
  // });
});
