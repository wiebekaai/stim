window.customElements.define(
  'my-component',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '🙆‍♂️';
    }
  },
);
