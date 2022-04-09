import {
  convertInteractionsToNodeModelArray,
  getDepth,
  getParents,
  getParentsFromNodeModel,
} from "src/models/interaction-list";
import {
  firstLevelInteraction,
  mockInteractions,
  secondLevelInteraction,
  zeroLevelInteraction,
} from "../__mocks__/mockProject";

describe("interaction list", () => {
  it("convert interactions to node model array", () => {
    const [mockInteraction] = mockInteractions;

    const [nodeModel] = convertInteractionsToNodeModelArray([mockInteraction]);
    expect(nodeModel).toEqual(
      expect.objectContaining({
        data: { type: expect.any(String) },
        droppable: expect.any(Boolean),
        id: expect.any(String),
        parent: expect.any(String),
        text: expect.any(String),
      })
    );
  });

  it("returns directory of parents", () => {
    const nodeModelArray = convertInteractionsToNodeModelArray(mockInteractions);
    const directory = getParentsFromNodeModel(nodeModelArray);

    for (const { id } of nodeModelArray) {
      expect(directory).toHaveProperty(id.toString());
    }
  });

  it("returns array of parent ids", () => {
    expect(getParents(mockInteractions, zeroLevelInteraction.id)).toHaveLength(0);
    expect(getParents(mockInteractions, firstLevelInteraction.id)).toHaveLength(1);
    expect(getParents(mockInteractions, secondLevelInteraction.id)).toHaveLength(2);
  });

  it("returns depth", () => {
    const nodeModelArray = convertInteractionsToNodeModelArray(mockInteractions);

    expect(getDepth(nodeModelArray, zeroLevelInteraction.id)).toEqual(1);
    expect(getDepth(nodeModelArray, firstLevelInteraction.id)).toEqual(2);
    expect(getDepth(nodeModelArray, secondLevelInteraction.id)).toEqual(3);
  });
});
