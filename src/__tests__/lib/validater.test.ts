import { validateProjectName } from "src/lib/validater";

describe("validate project name", () => {
  it("is required", () => {
    expect(validateProjectName("")).toBeTruthy();
  });

  it("can only include letters and spaces", () => {
    expect(validateProjectName("#")).toBeTruthy();
  });
});
