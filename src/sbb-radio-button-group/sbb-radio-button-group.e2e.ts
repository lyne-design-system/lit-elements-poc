import { assert, expect, fixture, oneEvent, waitUntil } from "@open-wc/testing";
import { html } from 'lit/static-html.js';
import { sendKeys } from "@web/test-runner-commands";
import { SbbRadioButtonGroup } from "./sbb-radio-button-group";
import { SbbRadioButton } from "../sbb-radio-button/sbb-radio-button";

describe('sbb-radio-button-group', () => {
  let element: SbbRadioButtonGroup;
  let radios: SbbRadioButton[];

  beforeEach(async () => {
    element = await fixture(html`
    <sbb-radio-button-group name="radio-group-name" value="Value one">
        <sbb-radio-button id="sbb-radio-1" value="Value one">Value one</sbb-radio-button>
        <sbb-radio-button id="sbb-radio-2" value="Value two">Value two</sbb-radio-button>
        <sbb-radio-button id="sbb-radio-3" value="Value three" disabled>Value three</sbb-radio-button>
        <sbb-radio-button id="sbb-radio-4" value="Value four">Value four</sbb-radio-button>
      </sbb-radio-button-group>
    `);
    radios = Array.from(element.querySelectorAll('sbb-radio-button'));
  });

  it('is defined', () => {
    assert.instanceOf(element, SbbRadioButtonGroup);
    assert.instanceOf(radios[0], SbbRadioButton);
  });

  describe.only('events', () => {
    it('selects radio on click', async () => {
      const firstRadio = radios[0];
      const radio = radios[1];

      expect(firstRadio).to.have.attribute('checked');

      radio.click();
      await element.updateComplete; // TODO decorator problem

      expect(radio).to.have.attribute('checked');
      expect(firstRadio).not.to.have.attribute('checked');
    });

    it('dispatches event on radio change', async () => {
      const firstRadio = radios[0];
      const checkedRadio = radios[1];

      setTimeout(() => checkedRadio.click());

      await oneEvent(element, 'change');
      await oneEvent(element, 'input');

      firstRadio.click();
      await element.updateComplete;
      expect(firstRadio).to.have.attribute('checked');
    });

    it('does not select disabled radio on click', async () => {
      const firstRadio = radios[0];
      const disabledRadio = radios[2];

      disabledRadio.click();
      await element.updateComplete;

      expect(disabledRadio).not.to.have.attribute('checked');
      expect(firstRadio).to.have.attribute('checked');
    });

    it('preserves radio button disabled state after being disabled from group', async () => {
      const firstRadio = radios[0];
      const secondRadio = radios[0];
      const disabledRadio = radios[2];

      element.disabled = true;
      await element.updateComplete;

      disabledRadio.click();
      await element.updateComplete;

      expect(disabledRadio).not.to.have.attribute('checked');
      expect(firstRadio).to.have.attribute('checked');

      secondRadio.click();
      await element.updateComplete;
      expect(secondRadio).not.to.have.attribute('checked');

      element.disabled = false;
      await element.updateComplete;

      disabledRadio.click();
      await element.updateComplete;

      expect(disabledRadio).not.to.have.attribute('checked');
      expect(firstRadio).to.have.attribute('checked');
    });

    it('selects radio on left arrow key pressed', async () => {
      const firstRadio = radios[0];
      const radio = radios[3];

      firstRadio.click();
      await element.updateComplete;

      await sendKeys({ press: 'ArrowLeft' });
      await element.updateComplete;

      expect(radio).to.have.attribute('checked');

      firstRadio.click();
      await element.updateComplete;

      expect(firstRadio).to.have.attribute('checked');
    });

    it('selects radio on right arrow key pressed', async () => {
      const firstRadio = radios[0];
      const radio = radios[1];

      firstRadio.click();
      await element.updateComplete;

      await sendKeys({ press: 'ArrowRight'});

      await element.updateComplete

      expect(radio).to.have.attribute('checked');

      firstRadio.click();
      await element.updateComplete;

      expect(firstRadio).to.have.attribute('checked');
    });

    it('wraps around on arrow key navigation', async () => {
      const firstRadio = radios[0];
      const checkedRadio = radios[1];

      checkedRadio.click();
      await element.updateComplete;
      expect(checkedRadio).to.have.attribute('checked');

      await sendKeys({ press: 'ArrowRight'});
      await sendKeys({ press: 'ArrowRight'});

      await element.updateComplete;

      expect(firstRadio).to.have.attribute('checked');
    });
  });
});
