import { customElement, property, state } from 'lit/decorators.js';
import { LitElement, PropertyValues, html, nothing } from 'lit';
import { getNextElementIndex, isArrowKeyPressed } from '../global/helpers/arrow-navigation';
import { toggleDatasetEntry } from '../global/helpers/dataset';
import { HandlerRepository, createNamedSlotState, namedSlotChangeHandlerAspect } from '../global/helpers/eventing';
import { RadioButtonStateChange } from '../sbb-radio-button/sbb-radio-button.custom';
import { InterfaceSbbRadioButtonGroupAttributes } from './sbb-radio-button-group.custom';
import { SbbRadioButton } from '../sbb-radio-button/sbb-radio-button';
import Style from './sbb-radio-button-group.scss';

/**
 * @slot unnamed - Use this to provide radio buttons within the group.
 * @slot error - Use this to provide a `sbb-form-error` to show an error message.
 */

@customElement('sbb-radio-button-group')
export class SbbRadioButtonGroup extends LitElement {
  static override styles = Style;

  /**
   * Whether the radios can be deselected.
   */
  @property({type: Boolean}) public allowEmptySelection = false;

  /**
   * Whether the radio group is disabled.
   */
  @property({type: Boolean}) public disabled = false;

  /**
   * Whether the radio group is required.
   */
  @property({type: Boolean}) public required = false;

  /**
   * The value of the radio group.
   */
  @property() public value?: any | null;

  /**
   * Size variant, either m or s.
   */
  @property() public size: InterfaceSbbRadioButtonGroupAttributes['size'] = 'm';

  /**
   * Overrides the behaviour of `orientation` property.
   */
  @property({ reflect: true })
  public horizontalFrom?: InterfaceSbbRadioButtonGroupAttributes['horizontalFrom'];

  /**
   * Radio group's orientation, either horizontal or vertical.
   */
  @property({ reflect: true })
  public orientation: InterfaceSbbRadioButtonGroupAttributes['orientation'] = 'horizontal';

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('error');

  private get _element(): HTMLElement {return this}

  private _hasSelectionPanel: boolean;

  // @Watch('value')
  public valueChanged(value: any | undefined): void {
    for (const radio of this._radioButtons) {
      radio.checked = radio.value === value;
      radio.tabIndex = this._getRadioTabIndex(radio);
    }
    this._setFocusableRadio();
  }

  // @Watch('disabled')
  public updateDisabled(): void {
    for (const radio of this._radioButtons) {
      toggleDatasetEntry(radio, 'groupDisabled', this.disabled);
      radio.tabIndex = this._getRadioTabIndex(radio);
    }
    this._setFocusableRadio();
  }

  // @Watch('required')
  public updateRequired(): void {
    for (const radio of this._radioButtons) {
      toggleDatasetEntry(radio, 'groupRequired', this.required);
    }
  }

  // @Watch('size')
  public updateSize(): void {
    for (const radio of this._radioButtons) {
      radio.size = this.size;
    }
  }

  // @Watch('allowEmptySelection')
  public updateAllowEmptySelection(): void {
    for (const radio of this._radioButtons) {
      radio.allowEmptySelection = this.allowEmptySelection;
    }
  }

  /**
   * Emits whenever the radio group value changes.
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  // @Event({
  //   bubbles: true,
  //   composed: true,
  // })
  // public didChange: EventEmitter;

  /**
   * Emits whenever the radio group value changes.
   */
  // @Event({
  //   bubbles: true,
  //   composed: true,
  // })
  // public change: EventEmitter;

  /**
   * Emits whenever the radio group value changes.
   */
  // @Event({
  //   bubbles: true,
  //   composed: true,
  // })
  // public input: EventEmitter;

  private _handlerRepository = new HandlerRepository(
    this._element,
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots)))
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._hasSelectionPanel = !!this._element.querySelector('sbb-selection-panel');
    toggleDatasetEntry(this._element, 'hasSelectionPanel', this._hasSelectionPanel);

    this.addEventListener('state-change', (ev: CustomEvent<RadioButtonStateChange>) => this.onRadioButtonSelect(ev), {passive: true});
    this.addEventListener('keydown', (ev: KeyboardEvent) => this.handleKeyDown(ev));

    this._handlerRepository.connect();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('value')) {
      this.valueChanged(this.value);
    }
    if (changedProperties.has('disabled')) {
      this.updateDisabled();
    }
    if (changedProperties.has('required')) {
      this.updateRequired();
    }
    if (changedProperties.has('size')) {
      this.updateSize();
    }
    if (changedProperties.has('allowEmptySelection')) {
      this.updateAllowEmptySelection();
    }
  }

  public onRadioButtonSelect(event: CustomEvent<RadioButtonStateChange>): void {
    event.stopPropagation();
    if (event.detail.type !== 'checked') {
      return;
    }

    if (event.detail.checked) {
      this.value = (event.target as HTMLInputElement).value;
      this._emitChange(this.value);
      return;
    }

    if (this.allowEmptySelection) {
      this._emitChange();
    }
  }

  private _emitChange(value?: string): void {
    this.dispatchEvent(new CustomEvent('change', {bubbles: true, composed: true, detail: { value }}))
    this.dispatchEvent(new CustomEvent('input', {bubbles: true, composed: true, detail: { value }}))
    this.dispatchEvent(new CustomEvent('didChange', {bubbles: true, composed: true, detail: { value }}))
  }

  private _updateRadios(): void {
    const value = this.value ?? this._radioButtons.find((radio) => radio.checked)?.value;

    for (const radio of this._radioButtons) {
      radio.checked = radio.value === value;
      radio.size = this.size;
      radio.allowEmptySelection = this.allowEmptySelection;

      toggleDatasetEntry(radio, 'groupDisabled', this.disabled);
      toggleDatasetEntry(radio, 'groupRequired', this.required);

      radio.tabIndex = this._getRadioTabIndex(radio);
    }

    this._setFocusableRadio();
  }

  private get _radioButtons(): SbbRadioButton[] {
    return (
      Array.from(this._element.querySelectorAll('sbb-radio-button')) as SbbRadioButton[]
    ).filter((el) => el.closest('sbb-radio-button-group') === this._element);
  }

  private get _enabledRadios(): SbbRadioButton[] | undefined {
    if (!this.disabled) {
      return this._radioButtons.filter((r) => !r.disabled);
    }
  }

  private _setFocusableRadio(): void {
    const checked = this._radioButtons.find((radio) => radio.checked && !radio.disabled);

    if (!checked && this._enabledRadios?.length > 0) {
      this._enabledRadios[0].tabIndex = 0;
    }
  }

  private _getRadioTabIndex(radio: SbbRadioButton): number {
    return (radio.checked || this._hasSelectionPanel) && !radio.disabled && !this.disabled ? 0 : -1;
  }

  public handleKeyDown(evt: KeyboardEvent): void {
    const enabledRadios: SbbRadioButton[] = this._enabledRadios;

    if (
      !enabledRadios ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this._element &&
        (evt.target as HTMLElement).parentElement !== this._element &&
        (evt.target as HTMLElement).parentElement.nodeName !== 'SBB-SELECTION-PANEL')
    ) {
      return;
    }

    if (!isArrowKeyPressed(evt)) {
      return;
    }

    let current: number;
    let nextIndex: number;

    if (this._hasSelectionPanel) {
      current = enabledRadios.findIndex((e: SbbRadioButton) => e === evt.target);
      nextIndex = getNextElementIndex(evt, current, enabledRadios.length);
    } else {
      const checked: number = enabledRadios.findIndex(
        (radio: SbbRadioButton) => radio.checked
      );
      nextIndex = getNextElementIndex(evt, checked, enabledRadios.length);
      enabledRadios[nextIndex].select();
    }

    enabledRadios[nextIndex].focus();
    evt.preventDefault();
  }

  override render() {
    this.setAttribute('role', 'radiogroup');

    return html`
      <div class="sbb-radio-group">
        <slot @slotchange="${() => this._updateRadios()}" />
      </div>
      ${this._namedSlots.error ? 
        html`
          <div class="sbb-radio-group__error">
            <slot name="error" />
          </div>
        ` : nothing
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sbb-radio-button-group': SbbRadioButtonGroup;
  }
}