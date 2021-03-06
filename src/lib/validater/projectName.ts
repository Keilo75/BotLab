const validateProjectName = (name: string): string | undefined => {
  if (name.length === 0) return "Cannot be empty";
  if (!name.match(/^[a-zA-Z\s]*$/)) return "May only include letters and spaces";
};

export default validateProjectName;
