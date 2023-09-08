import observeAddedElementNodes from '@/lib/observe-added-element-nodes';

import './main.css';
import './sm.css';

const identifiers: Record<string, string> = {
  'cart-drawer': 'cart-drawer',
};

const registerElements = async (node: HTMLElement) =>
  [node, ...Array.from(node.querySelectorAll('*'))]
    .filter((e) => e.tagName.includes('-'))
    .forEach((node) => {
      (async () => {
        const identifier = identifiers[node.tagName.toLowerCase()];

        if (!node.hasAttribute('data-load-eager')) {
          await new Promise((resolve) => {
            if ('requestIdleCallback' in window) window.requestIdleCallback(resolve);
            else setTimeout(resolve, 200);
          });
        }

        /**
         * Support TypeScript and JavaScript
         */
        const element = await (
          await Promise.all([
            (async () => {
              try {
                return (await import(`./elements/${identifier}.ts`)).default;
              } catch (e) {
                console.log(e);
                return null;
              }
            })(),
            (async () => {
              try {
                return (await import(`./elements/${identifier}.js`)).default;
              } catch (e) {
                console.log(e);
                return null;
              }
            })(),
          ])
        ).filter(Boolean)[0];

        if (element) {
          if (!customElements.get(identifier)) {
            console.log(`🏝️ ${identifier}`);
            customElements.define(identifier, element);
          }
        } else {
          console.error(
            `%cElement <${identifier}> not found! Please create it.

%c1. Create \`src/elements/${identifier}.ts\` or \`src/elements/${identifier}.js\`
2. Add \`export default class extends HTMLElement {}\`

%c🪄 Example
%cecho "export default class extends HTMLElement {}" > src/elements/${identifier}.ts
`,
            'font-weight:bold;',
            'color:white;',
            'font-weight:bold;color:white;',
            'color:white;',
          );
        }
      })();
    });

registerElements(document.body);
observeAddedElementNodes(document.body, registerElements);
