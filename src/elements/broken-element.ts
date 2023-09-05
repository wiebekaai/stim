import { attr, controller, target } from '@github/catalyst';

@controller
class BrokenElementElement extends HTMLElement {
  connectedCallback() {
    console.log('BrokenElementElement connected');
  }
}
