class e extends HTMLElement{async connectedCallback(){console.log(window.Shopify.routes.root),await fetch(`${window.Shopify.routes.root}?section_id=section`).then((e=>e.text())).then((e=>(new DOMParser).parseFromString(e,"text/html").body.firstChild));["[data-title]","[data-description]"].forEach((e=>{const t=document.querySelector(e);t?this.querySelector(e)?.replaceWith(t):this.querySelector(e)?.remove()}))}}export{e as default};
