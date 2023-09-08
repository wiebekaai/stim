export default class CartDrawer extends HTMLElement {
  async connectedCallback() {
    // this.innerHTML = 'cartDrawer some change';

    const a = await fetch(`${window.Shopify.routes.root}?section_id=section`)
      .then((response) => response.text())
      .then((text) => new DOMParser().parseFromString(text, 'text/html').body.firstChild);

    const selectorsToReplaceText = ['[data-title]', '[data-description]'];
    const selectorsToReplaceElements = ['[data-products]'];

    selectorsToReplaceText.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        this.querySelector(selector)?.replaceWith(element);
      } else {
        this.querySelector(selector)?.remove();
      }
    });
  }
}
