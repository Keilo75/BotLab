export const validateProjectName = (name: string): string | undefined => {
  if (name.length === 0) return "Required";
  if (!name.match(/^[a-zA-Z\s]*$/)) return "May only include letters and spaces";
};

export const validateInteractionName = (name: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming

  if (name.length === 0) return "Required";
  if (name.length > 32) return "Maximum length is 32 characters";
  if (!/^[\w-]{1,32}$/.test(name)) return "Cannot contain special characters";
};

export const validateSnowflake = (snowflake: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/reference#snowflakes
  // https://github.com/vegeta897/snow-stamp
  const number = parseInt(snowflake);

  if (!Number.isInteger(number)) return "Can only contain numbers";
};
