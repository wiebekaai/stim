import { controller, attr, target } from '@github/catalyst';

@controller
class ProductForm extends HTMLElement {
  @attr get dataSomething() {
    return '';
  }
  @target text;

  connectedCallback() {
    this.innerHTML = 'Hello World!';
  }

  set dataSomething(value) {}
}
