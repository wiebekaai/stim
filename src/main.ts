import elementImports from '@/elements';

const observeAddedElementNodes = (node: HTMLElement, callback: (node: HTMLElement) => unknown) =>
  new window.MutationObserver((mutations) =>
    mutations.forEach(({ addedNodes }) =>
      addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) callback(node as HTMLElement);
      }),
    ),
  ).observe(node, {
    childList: true,
    subtree: true,
  });

class InvalidElementError extends Error {}

const registerElements = async (node: HTMLElement) =>
  [node, ...Array.from(node.querySelectorAll('*'))]
    .map((node) => [node.tagName.toLowerCase(), node] as const)
    // Is custom element
    .filter(([tagName]) => tagName.includes('-'))
    // Is not defined
    .filter(([tagName]) => !customElements.get(tagName))
    .forEach(([tagName, node]) => {
      (async () => {
        // Wait for browser to be idle
        await new Promise((resolve) => {
          'requestIdleCallback' in window
            ? window.requestIdleCallback(resolve, { timeout: 500 })
            : setTimeout(resolve, 200);
        });

        const elementImport = elementImports[tagName]!;
        try {
          if (typeof elementImport !== 'function') throw new InvalidElementError();

          // Import + define element
          const Element = await elementImport().then(({ default: d }) => d);

          if (typeof Element !== 'function') throw new InvalidElementError();

          // Another check, preventing race condition
          if (!customElements.get(tagName)) {
            if (process.env.NODE_ENV !== 'production')
              console.log(`🌞 %c<${tagName}>%o`, 'font-weight:bold;color:white;', node);

            customElements.define(tagName, Element);
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            if (error instanceof InvalidElementError) {
              console.warn(
                `⛅ %c<${tagName}> not found! Please create your Custom Element in \`src/elements/${tagName}.{js,ts}\` and import it in \`src/elements.index.ts\`.
                
  %c🧙 Use the \`@element\` snippet to get started.
  `,
                'font-weight:bold;',
                'font-weight:bold;color:white;',
              );
            } else {
              throw error;
            }
          }
        }
      })();
    });

registerElements(document.body);
observeAddedElementNodes(document.body, registerElements);
