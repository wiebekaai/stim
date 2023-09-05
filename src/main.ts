import traverseDOM from '@/lib/traverse-dom';
import observeAddedElementNodes from '@/lib/observe-added-element-nodes';

import './main.css';

const importComponents = async (node: HTMLElement) =>
  traverseDOM(node, async (currentNode) => {
    const tagName = currentNode.tagName.toLowerCase();
    const isCustomElement = tagName.includes('-');

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

      try {
        await import(`./elements/${tagName}.ts`);
        console.log(`🏝️ ${tagName}`, currentNode);
      } catch (e) {
        console.warn(`No element found for <${tagName}>! Did you forget to add it to src/elements?`);
      }
    }
  });

importComponents(document.body);
observeAddedElementNodes(importComponents);
