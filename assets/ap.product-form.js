("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequire4b9b.register("839tR",function(e,t){Object.defineProperty(e.exports,"__esModule",{value:!0,configurable:!0}),Object.defineProperty(e.exports,"default",{get:()=>n,set:void 0,enumerable:!0,configurable:!0});class n extends HTMLElement{constructor(){super(),this.cart=document.querySelector("[data-cart-drawer]")}async connectedCallback(){let e=this.querySelector('form[action$="/cart/add"]');e&&e.addEventListener("submit",async e=>{e.preventDefault();let t=new FormData(e.currentTarget);t.append("sections","main-product"),t.append("sections_url",window.location.pathname),this.cart.setLoading();let n=await fetch(`${window.routes.cart_add_url}
      `,{method:"POST",headers:{Accept:"application/javascript"},body:t}).then(e=>e.json()).then(e=>e);this.cart.renderContents(n),this.cart.unsetLoading()})}}});