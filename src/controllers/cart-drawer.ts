import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['price'];

  declare readonly hasPriceTarget: boolean;
  declare readonly priceTarget: HTMLInputElement;
  declare readonly priceTargets: HTMLInputElement[];

  priceTargetConnected() {
    this.priceTarget.innerText = '100';
  }

  send() {
    this.dispatch('something', {
      detail: {
        price: 100,
      },
    });
  }
}
