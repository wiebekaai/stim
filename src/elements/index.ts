export default {
  // 🧙 Use the @import snippet
  'missing-element': () => import('./my-element'),
} as Record<string, () => Promise<{ default: CustomElementConstructor }>>;
