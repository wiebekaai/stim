export default class MyElement extends HTMLElement {
  connectedCallback() {
    console.log(`It's alive! 🧟`);

    this.innerHTML = `Initialized my-element!`;
  }
}
