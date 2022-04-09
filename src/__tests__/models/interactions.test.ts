import {
  getAllChildInteractions,
  getAllInteractionsWithSameParent,
  getInteractionName,
  hasTypeChoices,
  InteractionType,
  InteractionTypes,
  isTextBased,
} from "src/models/interactions";
import { mockInteractions } from "../__mocks__/mockProject";

describe("is text based", () => {
  it("returns true for text based interaction types", () => {
    expect(isTextBased("command")).toEqual(true);
    expect(isTextBased("folder")).toEqual(true);
  });

  it("returns false otherwise", () => {
    expect(isTextBased("message-context-menu")).toEqual(false);
    expect(isTextBased("user-context-menu")).toEqual(false);
  });
});

describe("has type choices", () => {
  it("returns true for command option types with choices", () => {
    expect(hasTypeChoices("string")).toEqual(true);
    expect(hasTypeChoices("number")).toEqual(true);
    expect(hasTypeChoices("integer")).toEqual(true);
  });

  it("returns false otherwise", () => {
    expect(hasTypeChoices()).toEqual(false);
    expect(hasTypeChoices("boolean")).toEqual(false);
    expect(hasTypeChoices("channel")).toEqual(false);
  });
});

describe("get all child interactions", () => {
  it("returns array of child interactions", () => {
    const parentInteractions = mockInteractions.filter((i) => i.type === "folder");

    for (const parentInteraction of parentInteractions) {
      expect(
        getAllChildInteractions(mockInteractions, parentInteraction.id).length
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns empty array for non parent interactions", () => {
    expect(getAllChildInteractions(mockInteractions, "invalid id")).toEqual([]);
  });
});

describe("get all interactions with same parents", () => {
  it("returns array of sibling interactions", () => {
    const parentInteractions = mockInteractions.filter((i) => i.type === "folder");

    for (const parentInteraction of parentInteractions) {
      const childInteraction = mockInteractions.find((i) => i.parent === parentInteraction.id);
      if (!childInteraction) continue;

      expect(
        getAllInteractionsWithSameParent(mockInteractions, childInteraction.parent).length
      ).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("get interaction name", () => {
  it("returns correct name for text based interactions", () => {
    const textBasedTypes: InteractionType[] = ["command", "folder"];
    textBasedTypes.forEach((type) => expect(getInteractionName(type, true)).toBe(`new-${type}`));
  });

  it("returns correct name for ui based interactions", () => {
    const uiBasedTypes: InteractionType[] = ["event", "message-context-menu", "user-context-menu"];
    uiBasedTypes.forEach((type) =>
      expect(getInteractionName(type, false)).toBe(`New ${InteractionTypes[type]}`)
    );
  });
});
