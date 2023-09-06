import traverseDOM from '@/lib/traverse-dom';

const registeringOrRegisteredElements = new Set<string>();

const registerElements = async (node: HTMLElement) =>
  traverseDOM(node, async (currentNode) => {
    const identifier = currentNode.tagName.toLowerCase();
    const isCustomElement = identifier.includes('-');

    if (isCustomElement) {
      // Example: <my-element data-load-media="(min-width: 64rem)"> / <my-element data-load-media="lg+">
      if (currentNode.hasAttribute('data-load-media')) {
        const query = currentNode.getAttribute('data-load-media')!;

        const breakpoints = {
          'lg-': '(max-width: 64rem)', // 1024px
          'lg+': '(min-width: 64rem)',
        } as Record<string, string>;

        const mediaQuery = window.matchMedia(breakpoints[query] || query);
        await new Promise(function (resolve) {
          if (mediaQuery.matches) {
            resolve(true);
          } else {
            mediaQuery.addEventListener('change', resolve, { once: true });
          }
        });
      }

      // Example: <my-element data-load-visible> / <my-element data-load-visible="100px">
      if (currentNode.hasAttribute('data-load-visible')) {
        const rootMargin = currentNode.getAttribute('data-load-visible')! || '0px';
        await new Promise(function (resolve) {
          const observer = new window.IntersectionObserver(
            async function (entries) {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  observer.disconnect();
                  resolve(true);
                  break;
                }
              }
            },
            {
              rootMargin,
            },
          );
          observer.observe(currentNode);
        });
      }

      // Load on idle unless data-load-immediate is present, example: <my-element data-load-immediate>
      if (!currentNode.hasAttribute('data-load-immediate')) {
        await new Promise(function (resolve) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(resolve);
          } else {
            setTimeout(resolve, 200);
          }
        });
      }

      if (!registeringOrRegisteredElements.has(identifier)) {
        registeringOrRegisteredElements.add(identifier);

        console.log(`Registering ${identifier}`, currentNode);

        let element = null;

        try {
          element = await import(`./elements/${identifier}.ts`);
        } catch {}

        try {
          element = await import(`./elements/${identifier}.js`);
        } catch {}

        if (!element) console.warn(`No controller found for ${identifier}`, currentNode);
      }
    }
  });

registerElements(document.body);
