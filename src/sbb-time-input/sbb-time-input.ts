import { spread } from '@open-wc/lit-helpers';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { forwardEventToHost } from '../global/helpers/eventing'; //TODO Investigate why test esbuild fail if the import is from '../global/helpers'
import { focusInputElement, inputElement } from '../global/helpers/input-element';
import { FormAssociatedMixin } from '../global/form-associated-mixin';
import Style from './sbb-time-input.scss';

const REGEX_PATTERN = /[0-9]{3,4}/;
const REGEX_GROUPS_WITH_COLON = /([0-9]{1,2})?[.:,\-;_hH]?([0-9]{1,2})?/;
const REGEX_GROUPS_WO_COLON = /([0-9]{1,2})([0-9]{2})/;

@customElement('sbb-time-input')
export class SbbTimeInput extends FormAssociatedMixin(LitElement) {
  static override styles = Style;

  /** Value for the inner HTMLInputElement. */
  @property() public override get value(): string { return this._value };
  
  /** Date value with the given time for the inner HTMLInputElement. */
  @property({attribute: 'value-as-date', type: Object}) // TODO this should not have an attribute probably
  public get valueAsDate(): Date { 
    const regGroups = this._validateInput(this.value);
    return this._formatValueAsDate(regGroups);
  };

  /** The <form> element to associate the inner HTMLInputElement with. */
  // @property() public form?: string;

  /** Readonly state for the inner HTMLInputElement. */
  @property({type: Boolean}) public readonly?: boolean = false;

  /** Disabled state for the inner HTMLInputElement. */
  @property({type: Boolean}) public disabled?: boolean = false;

  /** Required state for the inner HTMLInputElement. */
  @property({type: Boolean}) public required?: boolean = false;

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  // @Event({ bubbles: true, cancelable: true }) public didChange: EventEmitter;

  /** Host element */
  // @Element() private _element!: HTMLElement;

  /** Placeholder for the inner HTMLInputElement.*/
  private _placeholder = 'HH:MM';
  private _value: string = '';

  /** Applies the correct format to values and triggers event dispatch. */
  private _updateValueAndEmitChange(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    inputElement(this).value = this.value;
    this._emitChange(event);
  }

  /**
   * Updates `value` and `valueAsDate`. The direct update on the `_inputElement` is required
   * to force the input change when the typed value is the same of the current one.
   */
  // private _updateValue(value: string): void {
  //   const regGroups = this._validateInput(value);
  //   this._value = this._formatValue(regGroups);
  // }

  /** Emits the change event. */
  private _emitChange(event: Event): void {
    forwardEventToHost(event, this);
    this.dispatchEvent(new Event('did-change', {composed: true, cancelable: true}))
  }

  /** Returns the right format for the `value` property . */
  private _formatValue(regGroups: RegExpMatchArray): string {
    if (!regGroups || regGroups.length <= 2 || (!regGroups[1] && !regGroups[2])) {
      return null;
    }
    if (this._isTimeInvalid(regGroups)) {
      return regGroups[0];
    }

    const hours = (regGroups[1] ?? '').padStart(2, '0');
    const minutes = (regGroups[2] || '').padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Returns the right format for the `valueAsDate` property:
   * sets the start date at 01.01.1970, then adds the typed hours/minutes.
   */
  private _formatValueAsDate(regGroups: RegExpMatchArray): Date {
    if (
      !regGroups ||
      regGroups.length <= 2 ||
      this._isTimeInvalid(regGroups) ||
      (!regGroups[1] && !regGroups[2])
    ) {
      return null;
    }

    return new Date(new Date(0).setHours(+regGroups[1] || 0, +regGroups[2] || 0, 0, 0));
  }

  /** Checks if values of hours and minutes are possible, to avoid non-existent times. */
  private _isTimeInvalid(regGroups: RegExpMatchArray): boolean {
    const hours = +regGroups[1] || 0;
    const minutes = +regGroups[2] || 0;
    return hours >= 24 || minutes >= 60;
  }

  /** Validate input against the defined RegExps. */
  private _validateInput(value: string): RegExpMatchArray {
    if (REGEX_PATTERN.test(value)) {
      // special case: the input is 3 or 4 digits; split like so: AB?:CD
      return value.match(REGEX_GROUPS_WO_COLON);
    } else if (value) {
      return value.match(REGEX_GROUPS_WITH_COLON);
    } else {
      return null;
    }
  }

  /**
   *  Validate the typed input; if an invalid char is inserted (letters, special chars..), it's removed.
   *  Using `REGEX_GROUPS_WITH_COLON` permits only to insert 4 numbers, possibly with a valid separator.
   */
  private _preventCharInsert(event: InputEvent): void {
    const match = (event.target as HTMLInputElement).value.match(REGEX_GROUPS_WITH_COLON);
    (event.target as HTMLInputElement).value = match ? match[0] : null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Forward focus call to input element
    this.focus = focusInputElement; // we could also override focus() directly
  }

  // @Watch('value')
  public override set value(newValue: string) {
    const oldValue = this._value;
    const regGroups = this._validateInput(newValue);
    this._value = this._formatValue(regGroups);

    this.internals.setFormValue(this._value); // Necessary to be recognized as a native form element
    this.requestUpdate('value', oldValue);
  }

  // @Watch('valueAsDate')
  public set valueAsDate(newValue: Date | string) {
    if (!newValue) {
      return;
    }
    if (!(newValue instanceof Date)) {
      newValue = new Date(newValue);
    }
    this.value = this._formatValue(
      this._validateInput(`${newValue.getHours()}:${newValue.getMinutes()}`)
    );
  }

  override render() {
    this.setAttribute('role', 'input')
    this.setAttribute('aria-required', this.required?.toString() ?? 'false')
    this.setAttribute('aria-readonly', this.readonly?.toString() ?? 'false')
    this.setAttribute('aria-disabled', this.disabled?.toString() ?? 'false')

    const inputAttributes = {
      role: 'presentation',
      disabled: this.disabled || null,
      readonly: this.readonly || null,
      required: this.required || null,
      value: this.value || null,
      placeholder: this._placeholder,
    };
    
    return html`
      <input
        type="text"
        ${spread(inputAttributes)}
        @input="${(event: InputEvent) => this._preventCharInsert(event)}"
        @change="${(event: Event) => this._updateValueAndEmitChange(event)}"
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sbb-time-input': SbbTimeInput;
  }
}
