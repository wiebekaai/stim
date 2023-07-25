const traverseDOM = async (node: HTMLElement, callback: (node: HTMLElement) => unknown) => {
  await callback(node);

  let child = node.firstElementChild;

  while (child) {
    traverseDOM(child as HTMLElement, callback);
    child = child.nextElementSibling;
  }
};

export default traverseDOM;
