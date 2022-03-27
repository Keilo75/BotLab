const validateSnowflake = (snowflake: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/reference#snowflakes
  // https://github.com/vegeta897/snow-stamp
  const number = parseInt(snowflake);

  if (!Number.isInteger(number)) return "Can only contain numbers";
};

export default validateSnowflake;
