import { attr, controller, targets } from '@github/catalyst';

@controller
class MyCustomElement extends HTMLElement {
  @attr componentMedia = '';

  @targets buttons!: HTMLElement[];

  connectedCallback() {
    // this.innerHTML = '🙆‍♂️';
    window.dispatchEvent(new CustomEvent('my-component-loaded'));

    console.log(this.componentMedia);
    console.log(this.buttons);
  }

  add() {
    console.log('add');
  }
}
