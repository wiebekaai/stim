import observeAddedElementNodes from '@/lib/observe-added-element-nodes';

const elementImportsByFilename = import(
  /** @ts-ignore */
  `./elements/*`
) as unknown as Record<string, () => Promise<{ default: CustomElementConstructor }>>;

const elementImports = Object.fromEntries(
  Object.entries(elementImportsByFilename).map(([filepath, element]) => [
    filepath.split('/').pop()!.replace('.ts', '').replace('.js', ''),
    async () => (await element()).default,
  ]),
);

const registerElements = async (node: HTMLElement) =>
  [node, ...Array.from(node.querySelectorAll('*'))]
    .map((e) => [e.tagName.toLowerCase(), e] as const)
    .filter(([tagName]) => tagName.includes('-'))
    .filter(([tagName]) => !customElements.get(tagName))
    .forEach(([tagName, node]) => {
      (async () => {
        await new Promise((resolve) => {
          if ('requestIdleCallback' in window) window.requestIdleCallback(resolve);
          else setTimeout(resolve, 200);
        });

        const elementImport = elementImports[tagName];

        if (elementImport) {
          const element = await elementImport();

          if (!customElements.get(tagName)) {
            customElements.define(tagName, element);
            if (process.env.NODE_ENV !== 'production') {
              console.log(`🏝️ %c<${tagName}>`, 'font-weight:bold;color:white;');
            }
          }
        } else {
          if (process.env.NODE_ENV !== 'production')
            console.error(
              `%c🏝️ <${tagName}> not found! Please create \`src/elements/${tagName}.ts\` or \`src/elements/${tagName}.js\` with a Custom Element.

%c✨ Command
%cecho "export default class extends HTMLElement { connectedCallback() { /** Een goed begin is het halve werk. */ } }" > src/elements/${tagName}.ts
  `,
              'font-weight:bold;',
              'font-weight:bold;color:white;',
              'color:white;',
            );
        }
      })();
    });

registerElements(document.body);
observeAddedElementNodes(document.body, registerElements);
