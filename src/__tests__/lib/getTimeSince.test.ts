import { getTimeSince } from "src/lib/getTimeSince";

describe("getTimeSince", () => {
  it("works with no difference", () => {
    expect(getTimeSince(Date.now())).toEqual("just now");
  });

  it("doesn't break when passed a timestamp in the future ", () => {
    expect(getTimeSince(Date.now() + 100)).toEqual("just now");
  });

  it("works with a minute", () => {
    expect(getTimeSince(Date.now() - 60 * 1000)).toEqual("1 minute ago");
  });

  it("works with multiple minutes", () => {
    expect(getTimeSince(Date.now() - 60 * 2 * 1000)).toEqual("2 minutes ago");
  });
});
