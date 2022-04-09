import {
  validateLength,
  validateName,
  validateProjectName,
  validateSnowflake,
} from "src/lib/validater";

describe("validate project name", () => {
  it("rejects invalid names", () => {
    expect(validateProjectName("")).toBeTruthy();
    expect(validateProjectName("#")).toBeTruthy();
  });

  it("works with a valid name", () => {
    expect(validateProjectName("valid name")).toBeFalsy();
  });
});

describe("validate length", () => {
  it("rejects invalid lengths", () => {
    expect(validateLength("", 1)).toBeTruthy();
    expect(validateLength("too long", 4)).toBeTruthy();
  });

  it("works with valid length", () => {
    expect(validateLength("valid length", 20)).toBeFalsy();
  });
});

describe("validate snowflake", () => {
  it("rejects invalid snowflakes", () => {
    expect(validateSnowflake("")).toBeTruthy();
    expect(validateSnowflake("5")).toBeTruthy();
    expect(validateSnowflake("hello")).toBeTruthy();
  });

  it("works with valid snowflakes", () => {
    expect(validateSnowflake("750041870083555360")).toBeFalsy();
  });
});

describe("validate interaction name", () => {
  it("rejects invalid names", () => {
    expect(validateName("", "command")).toBeTruthy();
    expect(validateName("this name is way too long and doesn't fit", "command")).toBeTruthy();
    expect(validateName("#", "command")).toBeTruthy();
  });

  it("works with a valid name", () => {
    expect(validateName("valid-name", "command")).toBeFalsy();
    expect(validateName("Valid Name 123", "message-context-menu")).toBeFalsy();
  });
});
