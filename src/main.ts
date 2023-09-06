import traverseDOM from '@/lib/traverse-dom';

import './main.css';

const registeredComponents = new Set<string>();

const registerControllers = async (node: HTMLElement) =>
  traverseDOM(node, async (currentNode) => {
    if (!window.Stimulus) await import('@/lib/stimulus');

    const identifier = currentNode.dataset.controller;

    console.log(currentNode, 'haha');

    if (identifier) {
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

      console.log('register', identifier);

      if (!registeredComponents.has(identifier)) {
        registeredComponents.add(identifier);

        try {
          const { default: controller } = await import(`./controllers/${identifier}.ts`);
          window.Stimulus.register(identifier, controller);
        } catch (e) {
          console.warn(`No controller found for ${identifier}`, currentNode);
        }
      }
    }
  });

registerControllers(document.body);
