const validateSnowflake = (snowflake: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/reference#snowflakes
  // https://github.com/vegeta897/snow-stamp
  const timestamp = +snowflake;

  if (!Number.isInteger(timestamp)) return "Can only contain numbers";
  if (timestamp < 4194304) return "Must be a bigger number";
};

export default validateSnowflake;
