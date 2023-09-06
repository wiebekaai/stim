import { controller, attr, target } from '@github/catalyst';

@controller
class ProductForm extends HTMLElement {
  @attr get dataSomething(): string {
    return '';
  }
  @target text!: HTMLParagraphElement;

  connectedCallback() {
    // this.innerHTML = 'Hello World!';
  }

  set dataSomething(value: string) {}
}
