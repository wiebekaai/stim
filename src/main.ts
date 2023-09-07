const observeAddedElementNodes = (node: HTMLElement, callback: (node: HTMLElement) => unknown) => {
  const observer = new window.MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i];
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        if (node.nodeType === Node.ELEMENT_NODE) callback(node as HTMLElement);
      }
    }
  });

  observer.observe(node, {
    childList: true,
    subtree: true,
  });
};

const registerElements = async (node: HTMLElement) =>
  [node, ...Array.from(node.querySelectorAll('*'))]
    .filter((e) => e.tagName.includes('-'))
    .forEach((node) => {
      (async () => {
        const identifier = node.tagName.toLowerCase();

        // await request idle, with a timeout fallback for browsers that don't support it
        await (window.requestIdleCallback ? window.requestIdleCallback : (cb: () => unknown) => setTimeout(cb, 100))(
          () => {},
        );

        /**
         * Support TypeScript and JavaScript
         */
        const element = await (
          await Promise.all([
            (async () => {
              try {
                return (await import(`./elements/${identifier}.ts`)).default;
              } catch {
                return null;
              }
            })(),
            (async () => {
              try {
                return (await import(`./elements/${identifier}.js`)).default;
              } catch {
                return null;
              }
            })(),
          ])
        ).filter(Boolean)[0];

        if (element) {
          if (!customElements.get(identifier)) customElements.define(identifier, element);
        } else {
          console.error(
            `Element <${identifier}> not found! Please create it.

1. Create \`src/elements/${identifier}.ts\` or \`src/elements/${identifier}.js\`
2. Add \`export default class extends HTMLElement {}\``,
          );
        }
      })();
    });

registerElements(document.body);
observeAddedElementNodes(document.body, registerElements);
