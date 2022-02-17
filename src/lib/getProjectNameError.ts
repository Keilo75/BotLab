export const getProjectNameError = (name: string): string | undefined => {
  if (name.length === 0) return "Required";
  if (!name.match(/^[a-zA-Z\s]*$/)) return "Project name may only include letters and spaces";

  return;
};
