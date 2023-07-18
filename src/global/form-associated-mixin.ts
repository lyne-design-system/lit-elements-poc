import { LitElement } from "lit";

// This can be factorized
type Constructor<T = {}> = new (...args: any[]) => T;

// Define the interface for the mixin
export interface FormAssociatedInterface {
    value: string;
    form: HTMLFormElement;
    name: string;
    type: string;
    internals: ElementInternals;
}

export const FormAssociatedMixin =  <T extends Constructor<LitElement>>(superClass: T) => {
    class FormAssociatedElement extends superClass {
        static formAssociated = true;

        internals: ElementInternals;
        private _value: string;

        constructor(...args: any[]) {
            super(...args);
            this.internals = this.attachInternals();
        }

        get value() {
            return this._value; 
        }
        
        set value(value) {
            this._value = value;
            this.internals.setFormValue(value);
        }

        get form() {
            return this.internals.form;
        }
        
        get name() {
            return this.getAttribute('name');
        }
        
        get type() {
            return this.localName;
        }
    }
    return FormAssociatedElement as Constructor<FormAssociatedInterface> & T;
};
