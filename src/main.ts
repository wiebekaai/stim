import traverseDOM from '@/lib/traverse-dom';

const registeringOrRegisteredElements = new Set<string>();

const importTsOrJs = async (path: string) =>
  (
    await Promise.all(
      ['ts', 'js'].map(async (e) => {
        try {
          (await import(`${path}.${e}`)).default;
        } catch (e) {
          return null;
        }
      }),
    )
  ).filter(Boolean)[0];

const registerElements = async (node: HTMLElement) =>
  traverseDOM(node, async (currentNode) => {
    const identifier = currentNode.tagName.toLowerCase();
    const isCustomElement = identifier.includes('-');

    if (isCustomElement) {
      if (!registeringOrRegisteredElements.has(identifier)) {
        registeringOrRegisteredElements.add(identifier);

        console.log(`Registering ${identifier}`, currentNode);

        const element = await importTsOrJs(`./elements/${identifier}`);

        if (element) {
          customElements.define(identifier, element);
        } else {
          console.warn(`No controller found for ${identifier}`, currentNode);
        }
      }
    }
  });

registerElements(document.body);
