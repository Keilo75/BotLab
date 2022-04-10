import {
  validateLength,
  validateName,
  validateProject,
  validateProjectName,
  validateSnowflake,
} from "src/lib/validater";
import { Interaction } from "src/models/interactions";
import {
  createMockInteraction,
  mockInteractions,
  mockProject,
  mockSettings,
} from "../__mocks__/mockProject";

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

describe("validate project", () => {
  it("returns the correct stacktrace", () => {
    const interactions: Interaction[] = [];
    interactions.push(createMockInteraction({ name: "" }));
    interactions.push(
      createMockInteraction({
        permissions: {
          disabledByDefault: true,
          exceptions: [{ id: "", type: "role", identifier: "" }],
        },
      })
    );

    const [nameError, permissionsError] = validateProject({ interactions, settings: mockSettings });
    expect(nameError).toBeDefined();
    expect(nameError.stacktrace).toHaveLength(1);
    expect(nameError.stacktrace[0].key).toEqual("interaction name");

    expect(permissionsError).toBeDefined();
    expect(permissionsError.stacktrace).toHaveLength(2);
    expect(permissionsError.stacktrace[0].type).toEqual("interaction");
    expect(permissionsError.stacktrace[1].type).toEqual("permission exception");
  });

  it("works with a valid project ", () => {
    expect(validateProject(mockProject)).toHaveLength(0);
  });
});
