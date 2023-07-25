const observeAddedElementNodes = (callback: (node: HTMLElement) => unknown) => {
  const observer = new window.MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i];
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        if (node.nodeType === Node.ELEMENT_NODE) callback(node as HTMLElement);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export default observeAddedElementNodes;
