import { getParents } from "src/models/interaction-list";
import { Interaction } from "src/models/interactions";
import { Project, ProjectSettings } from "src/models/project";

export const mockInteractions: Interaction[] = [
  {
    id: "8f7ed8b9-0fd5-4468-b271-238992922904",
    name: "new-command",
    parent: "72c14d53-265d-4691-8f73-7ca75e899d9b",
    type: "command",
    permissions: {
      disabledByDefault: false,
      exceptions: [],
    },
    description: "",
    options: [],
  },
  {
    id: "72c14d53-265d-4691-8f73-7ca75e899d9b",
    name: "role",
    parent: "58e7b85a-82f5-445d-9e1f-125212d50b8e",
    type: "folder",
    permissions: {
      disabledByDefault: false,
      exceptions: [],
    },
    description: "Get or edit permissions for a role",
  },
  {
    id: "e7045c50-3901-421a-b57e-6b9677b24f6b",
    name: "user",
    parent: "58e7b85a-82f5-445d-9e1f-125212d50b8e",
    type: "folder",
    permissions: {
      disabledByDefault: false,
      exceptions: [],
    },
    description: "Get or edit permissions for a user",
  },
  {
    id: "58e7b85a-82f5-445d-9e1f-125212d50b8e",
    name: "permissions",
    parent: "0",
    type: "folder",
    permissions: {
      disabledByDefault: false,
      exceptions: [],
    },
    description: "Get or edit permissions for a user or role",
  },
  {
    id: "e0d7b3ba-e5e8-43e5-a440-a8a12baae31c",
    name: "ping",
    parent: "0",
    type: "command",
    permissions: {
      disabledByDefault: false,
      exceptions: [],
    },
    description: "Show's the bots ping",
    options: [],
  },
  {
    id: "298d580e-bf4f-444d-9a7b-e49b8d132afc",
    name: "ban",
    parent: "0",
    type: "command",
    permissions: {
      disabledByDefault: true,
      exceptions: [
        {
          type: "role",
          identifier: "41985782315566",
          id: "7b6c273b-adb5-4480-9e57-969fa85c3082",
        },
      ],
    },
    description: "Ban a user",
    options: [
      {
        id: "2d7cd549-c8c6-4ada-bc3e-95c42be349f9",
        name: "user",
        description: "The user to ban",
        type: "user",
        required: true,
      },
      {
        id: "a559fc5c-8b2a-4ce4-b00e-f8cfd013d001",
        name: "reason",
        description: "The ban reason",
        type: "string",
        required: false,
      },
    ],
  },
  {
    id: "dce9c7de-af49-4f58-99d5-c26dc5182a5d",
    name: "deploy",
    parent: "0",
    type: "command",
    permissions: {
      disabledByDefault: true,
      exceptions: [
        {
          type: "user",
          identifier: "5235729357235",
          id: "ccddfb95-47bc-441f-b776-4b1537fec6fe",
        },
      ],
    },
    description: "Deploy the bots commands",
    options: [
      {
        id: "54ac1290-9503-48d7-991e-ee2bbebcc774",
        name: "scope",
        description: "The scope to deploy the commands to",
        type: "string",
        required: true,
        choices: [
          {
            name: "Global",
            value: "global",
            id: "b05f4581-05fe-4cd4-a34b-61decaf4404e",
          },
          {
            name: "Server",
            value: "server",
            id: "b08204a8-ff0f-42a5-b15f-bd362ea4839f",
          },
        ],
      },
    ],
  },
];

export const zeroLevelInteraction = mockInteractions.find((i) => i.parent === "0") as Interaction;

export const firstLevelInteraction = mockInteractions.find(
  (i) => getParents(mockInteractions, i.id).length === 1
) as Interaction;

export const secondLevelInteraction = mockInteractions.find(
  (i) => getParents(mockInteractions, i.id).length === 2
) as Interaction;

export const mockSettings: ProjectSettings = {
  name: "TestBot",
  token: "dsad",
};

export const mockProject: Project = { settings: mockSettings, interactions: mockInteractions };
