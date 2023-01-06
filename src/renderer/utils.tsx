export const checkPath = async (path: string): Promise<boolean> => {
	const result = await window.electronAPI.checkPath(path);
	return result;
};
