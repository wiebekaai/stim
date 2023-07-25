import 'vite/modulepreload-polyfill';

import traverseDOM from '../lib/traverse-dom';
import observeAddedElementNodes from '../lib/observe-added-element-nodes';

const env = import.meta.env.MODE || 'production';
const componentImportFunctions = import.meta.glob(['../components/*.ts', '../components/*.js']);

/**
 * Dynamically import components based on their tag.
 *
 * 🏝️ This is a simplified version of the "Islands Architecture" pattern
 * https://www.patterns.dev/posts/islands-architecture
 *
 * ✨ To allow multiple instances of a component, use web components.
 * 💬 Since we're using TailwindCSS, avoid inline styles and the Shadow DOM.
 * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
 *
 * 🧪 Make the most of Liquid. JavaScript should be used to enhance user experiences.
 *
 * Example: <my-component></my-component> => components/my-component.ts
 */
const importComponents = async (node: HTMLElement) =>
  traverseDOM(node, async (currentNode) => {
    const tagName = currentNode.tagName.toLowerCase();

    const importComponent =
      componentImportFunctions[`../components/${tagName}.ts`] ||
      componentImportFunctions[`../components/${tagName}.js`];

    if (importComponent) {
      /**
       * Examples: <my-component data-component-media="(min-width: 64rem)">
       */
      if (currentNode.hasAttribute('data-component-media')) {
        const query = currentNode.getAttribute('data-component-media')!;

        // Example of named breakpoints
        const breakpoints = {
          //   'lg-': '(max-width: 64rem)', // 1024px
          //   'lg+': '(min-width: 64rem)', // 1024px
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

      /**
       * Example: <my-component data-component-visible="100px">
       */
      if (currentNode.hasAttribute('data-component-visible')) {
        const rootMargin = currentNode.getAttribute('data-component-visible')! || '0px';
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
            }
          );
          observer.observe(currentNode);
        });
      }

      /**
       * Example: <my-component data-component-idle>
       */
      if (currentNode.hasAttribute('data-component-idle')) {
        await new Promise(function (resolve) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(resolve);
          } else {
            setTimeout(resolve, 200);
          }
        });
      }

      importComponent();

      if (env === 'development') {
        console.groupCollapsed(`🏝️ ${tagName}`);
        console.log(currentNode);
        console.groupEnd();
      }
    }
  });

importComponents(document.body);
observeAddedElementNodes(importComponents);
