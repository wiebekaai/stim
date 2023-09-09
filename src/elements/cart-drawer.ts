export default class CartDrawer extends HTMLElement {
  renderContents(a: any) {
    const s = a.sections['main-product'];
    const html = new DOMParser().parseFromString(s, 'text/html');

    html.querySelectorAll('[data-line-item]').forEach((l) => {
      const id = l.getAttribute('data-line-item')!;

      const lineItem = this.querySelector(`[data-line-item="${id}"]`)!;

      const replaceContents = ['[data-title]', '[data-quantity]'];

      replaceContents.forEach((c) => {
        lineItem.querySelector(c)!.textContent = html.querySelector(c)?.textContent || '';
      });
    });
  }

  setLoading() {
    this.setAttribute('data-loading', '');
  }

  unsetLoading() {
    this.removeAttribute('data-loading');
  }
}
