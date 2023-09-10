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

const elementImportsByPath = import(
  /** @ts-ignore */
  `./elements/*`
) as unknown as Record<string, () => Promise<{ default: CustomElementConstructor }>>;

const elementImports = Object.fromEntries(
  Object.entries(elementImportsByPath).map(([filepath, elementImport]) => [
    // Path to tag name
    filepath.split('/').pop()!.replace('.ts', '').replace('.js', ''),
    async () => elementImport().then(({ default: Element }) => Element),
  ]),
);

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

        const elementImport = elementImports[tagName];

        try {
          if (!elementImport) throw new InvalidElementError();

          // Import + define element
          const Element = await elementImport();

          if (typeof Element !== 'function') throw new InvalidElementError();

          // Another check, preventing race condition
          if (!customElements.get(tagName)) {
            if (process.env.NODE_ENV !== 'production')
              console.log(`🌞 %c<${tagName}>%o`, 'font-weight:bold;color:white;', node);

            customElements.define(tagName, Element);
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production' && error instanceof InvalidElementError)
            console.error(
              `⛅ %c<${tagName}> not found!
              
%c🧙 Create \`src/elements/${tagName}.ts\` and use the \`@element\` snippet to create a Custom Element class.
`,
              'font-weight:bold;',
              'font-weight:bold;color:white;',
            );
        }
      })();
    });

registerElements(document.body);
observeAddedElementNodes(document.body, registerElements);
