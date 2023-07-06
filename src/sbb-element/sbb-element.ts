/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  // Getter property
  public get getProperty(): string {
    return 'test get property';
  }

  // Get/Set property
  private _prop = '';
  @property()
  public get setProperty() {
    return this._prop;
  }
  public set setProperty(value) {
    this.requestUpdate('setProperty', this._prop)
    this._prop = value;
  }

//   private _testController!: TestController;
  
  // Or simply
  //private _testController = new TestController(this);

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
    // this._testController = new TestController(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // this.removeController(this._testController);
  }

  override render() {
    return html`
      <h1>${this._sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
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
