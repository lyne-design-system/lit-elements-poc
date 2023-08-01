import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { TestController } from './controller';
import Style from './sbb-element.scss';


/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = Style;
  // static override styles = [];

  /**
   * The name to say "Hello" to.
   */
  @property()
  public name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  public count = 0;

  // Getter property
  public get getProperty(): string {
    return 'test get property';
  }

  // Get/Set property
  private _prop = '';
  @property({attribute: 'property'})
  public get property() {
    return this._prop;
  }
  public set property(value) {
    this.requestUpdate('setProperty', this._prop)
    this._prop = value;
  }

  // Init a Controller (This is advanced, we'll see it another time)
  private _testController = new TestController(this);
  public _btnRef: Element;

  /**
   * Public function doc
   */
  public testFunction(): void {
    console.log('test');
    
    this.requestUpdate();
    this.ariaRequired = 'true';
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private _onClick() {
    this.count++;

    // There are no native EventEmitter
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  override render() {
    this.setAttribute('data-state', 'initial');
    return html`
      <h1>${this._sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button" ${ref((ref) => this._btnRef = ref)}>
        Click Count: ${this.count}
      </button>
      <div class="prop-display">Prop: ${this._prop}</div>
      <slot></slot>
    `;
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  private _sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
