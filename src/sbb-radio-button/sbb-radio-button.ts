import { AgnosticMutationObserver as MutationObserver } from '../global/helpers/mutation-observer';
import {
  InterfaceSbbRadioButtonAttributes,
  RadioButtonStateChange,
} from './sbb-radio-button.custom';
import { isValidAttribute, setOptionalAttribute } from '../global/helpers/is-valid-attribute';
import { HandlerRepository, createNamedSlotState, documentLanguage, formElementHandlerAspect, languageChangeHandlerAspect, namedSlotChangeHandlerAspect } from '../global/helpers/eventing';

import { i18nCollapsed, i18nExpanded } from '../global/i18n';
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import Style from './sbb-radio-button.scss';

/** Configuration for the attribute to look at if component is nested in a sbb-radio-button-group */
const radioButtonObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-required', 'data-group-disabled'],
};

/**
 * @slot unnamed - Use this slot to provide the radio label.
 * @slot subtext - Slot used to render a subtext under the label (only visible within a selection panel).
 * @slot suffix - Slot used to render additional content after the label (only visible within a selection panel).
 */
@customElement('sbb-radio-button')
export class SbbRadioButton extends LitElement {
  static override styles = Style;

  /**
   * Whether the radio can be deselected.
   */
  @property({ attribute: 'allow-empty-selection', type: Boolean }) 
  public allowEmptySelection = false;

  /**
   * Value of radio button.
   */
  @property() public value: string;

  /**
   * Whether the radio button is disabled.
   */
  @property({ reflect: true, type: Boolean }) 
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Whether the radio button is required.
   */
  @property({ type: Boolean }) public required = false;

  /**
   * Whether the radio button is checked.
   */
  @property({ type: Boolean }) 
  public get checked() {
    return this._checked;
  }

  /**
   * Label size variant, either m or s.
   */
  @property({ reflect: true }) 
  public size: InterfaceSbbRadioButtonAttributes['size'] = 'm';

  /**
   * Whether the component must be set disabled due disabled attribute on sbb-radio-button-group.
   */
  @state() private _disabledFromGroup = false;

  /**
   * Whether the component must be set required due required attribute on sbb-radio-button-group.
   */
  @state() private _requiredFromGroup = false;

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('subtext', 'suffix');

  /**
   * Whether the input is the main input of a selection panel.
   */
  @state() private _isSelectionPanelInput = false;

  /**
   * The label describing whether the selection panel is expanded (for screen readers only).
   */
  @state() private _selectionPanelExpandedLabel: string;

  @state() private _currentLanguage = documentLanguage();

  private _disabled = false;
  private _checked = false;
  private _selectionPanelElement: HTMLElement;
  private _radioButtonAttributeObserver = new MutationObserver(
    this._onRadioButtonAttributesChange.bind(this)
  );

  private get _element(): HTMLElement {
    return this;
  }

  /**
   * Internal event that emits whenever the state of the radio option
   * in relation to the parent selection panel changes.
   */
  // @Event({
  //   bubbles: true,
  //   eventName: 'state-change',
  // })
  // public stateChange: EventEmitter<RadioButtonStateChange>;
  
  public set checked(value) {
    if(this._checked === value) 
      return;
 
    const oldValue = this._checked;
    this._checked = value;
    // this.requestUpdate('checked', oldValue, {reflect: true})
    this.requestUpdate('checked', oldValue) // if we use a setter, we need to manually call the 'requestUpdate()' method
    this.dispatchEvent(new CustomEvent<RadioButtonStateChange>('state-change', {bubbles: true, detail: { type: 'checked', checked: this._checked }}))
    !!this._selectionPanelElement && this._updateExpandedLabel();
  }

  public set disabled(value) {
    if(this._disabled === value) 
      return;

    this._disabled = value;
    this.requestUpdate()
    this.dispatchEvent(new CustomEvent('state-change', {bubbles: true, detail: { type: 'disabled', disabled: this._disabled }}))
  }

  private _handleClick(event: Event) {
    event.preventDefault();
    this.select();
  }

  public select(): Promise<void> {
    if (this.disabled || this._disabledFromGroup) {
      return;
    }

    if (this.allowEmptySelection) {
      this.checked = !this.checked;
    } else if (!this.checked) {
      this.checked = true;
    }
  }

  private _handlerRepository = new HandlerRepository(
    this._element,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
    formElementHandlerAspect
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    // We can use closest here, as we expect the parent sbb-selection-panel to be in light DOM.
    this._selectionPanelElement = this._element.closest('sbb-selection-panel');
    this._isSelectionPanelInput =
      !!this._selectionPanelElement &&
      !this._element.closest('sbb-selection-panel [slot="content"]');
    this._setupInitialStateAndAttributeObserver();
  }

  override firstUpdated(): void {
    super.firstUpdated(null);
    !!this._selectionPanelElement && this._updateExpandedLabel();

    this.addEventListener('click', (e) => this._handleClick(e));
    this.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._radioButtonAttributeObserver.disconnect();
  }

  public handleKeyDown(evt: KeyboardEvent) {
    if (evt.code === 'Space') {
      this.select();
    }
  }

  // Set up the initial disabled/required values and start observe attributes changes.
  private _setupInitialStateAndAttributeObserver(): void {
    const parentGroup = this._element.closest('sbb-radio-button-group') as any; // TODO remove this when the radio group is migrated
    if (parentGroup) {
      this._requiredFromGroup = isValidAttribute(parentGroup, 'required');
      this._disabledFromGroup = isValidAttribute(parentGroup, 'disabled');
      this.size = parentGroup.size;
    }
    this._radioButtonAttributeObserver.observe(this._element, radioButtonObserverConfig);
  }

  /** Observe changes on data attributes and set the appropriate values. */
  private _onRadioButtonAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'data-group-disabled') {
        this._disabledFromGroup = !!isValidAttribute(this._element, 'data-group-disabled');
      }
      if (mutation.attributeName === 'data-group-required') {
        this._requiredFromGroup = !!isValidAttribute(this._element, 'data-group-required');
      }
    }
  }

  private _updateExpandedLabel(): void {
    if (!this._selectionPanelElement.hasAttribute('data-has-content')) {
      return;
    }

    this._selectionPanelExpandedLabel = this.checked
      ? ', ' + i18nExpanded[this._currentLanguage]
      : ', ' + i18nCollapsed[this._currentLanguage];
  }

  override render() {
    this.setAttribute('role', 'radio')
    this.setAttribute('aria-checked', (!!this._checked).toString())
    this.setAttribute('aria-required', (this.required || this._requiredFromGroup).toString());
    this.setAttribute('aria-disabled', (this.disabled || this._disabledFromGroup).toString());
    setOptionalAttribute(this, 'data-is-selection-panel-input', this._isSelectionPanelInput);
    setOptionalAttribute(this, 'checked', this.checked);

    return html`
      <label class="sbb-radio-button">
        <input
        class="sbb-radio-button__input"
          type="radio"
          aria-hidden="true"
          tabindex="-1"
          ?disabled=${this.disabled || this._disabledFromGroup}
          ?required=${this.required || this._requiredFromGroup}
          ?checked=${this.checked}
          value=${ifDefined(this.value)}
        /> <!-- OR value=${this.value ?? nothing} both checks only for undefined & null -->
        <!-- OR value=${this.value || nothing} checks for truthy -->
        <span class="sbb-radio-button__label-slot">
          <slot />
          ${!!this._selectionPanelElement && this._namedSlots['suffix'] ? html`<slot name="suffix" />` : nothing}
        </span>
        ${!!this._selectionPanelElement && this._namedSlots['subtext'] ? html`<slot name="subtext" />` : nothing}
        ${!!this._selectionPanelElement && this._selectionPanelExpandedLabel 
          ? ( html`
          <!-- For screen readers only -->
          <span class="sbb-radio-button__expanded-label">
            ${this._selectionPanelExpandedLabel}
          </span>`
        ) : nothing}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sbb-radio-button': SbbRadioButton;
  }
}
