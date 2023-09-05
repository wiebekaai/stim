import { attr, controller, target } from '@github/catalyst';

@controller
class CartDrawerElement extends HTMLElement {
  @attr transitionDuration: number = 300;

  @target dialog!: HTMLDialogElement;

  transitionTimeout: number = 0;

  open() {
    this.dialog.removeAttribute('data-closing');

    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);

    this.dialog.showModal();
  }

  close() {
    this.dialog.setAttribute('data-closing', '');

    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);

    this.transitionTimeout = setTimeout(() => {
      this.dialog.removeAttribute('data-closing');
      this.dialog.close();
    }, this.transitionDuration);
  }
}
