const tryImport = async (path: string): Promise<any> => {
  try {
    await import(path);
  } catch (e) {
    return null;
  }
};

export default tryImport;
