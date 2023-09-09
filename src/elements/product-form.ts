import CartDrawer from '@/elements/cart-drawer';

export default class ProductForm extends HTMLElement {
  cart: CartDrawer;

  constructor() {
    super();
    this.cart = document.querySelector('[data-cart-drawer]')!;
  }

  connectedCallback() {
    const form = this.querySelector('form[action$="/cart/add"]')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      formData.append('sections', 'main-product');
      formData.append('sections_url', window.location.pathname);

      this.cart.setLoading();

      const cart = await fetch(
        `${window.routes.cart_add_url}
      `,
        { method: 'POST', headers: { Accept: `application/javascript` }, body: formData },
      )
        .then((response) => response.json())
        .then((data) => data);

      this.cart.renderContents(cart);

      this.cart.unsetLoading();
    });
  }
}
