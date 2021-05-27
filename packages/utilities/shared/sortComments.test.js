import sortComments from "./sortComments";

const comments = [
  {
    name: "pet",
    content: "pet",
    id: "194",
    parent: {
      id: "193",
    },
    children: null,
  },
  {
    name: "other pet",
    content: "other pet",
    id: "195",
    parent: {
      id: "193",
    },
    children: null,
  },
  {
    name: "child",
    content: "child",
    id: "193",
    parent: {
      id: "192",
    },
    children: null,
  },
  {
    name: "father",
    content: "father",
    id: "192",
    parent: {
      id: "191",
    },
    children: null,
  },
  {
    name: "grandfather",
    content: "grandfather",
    id: "191",
    parent: null,
    children: null,
  },
  {
    name: "fellow grandfather",
    content: "fellow grandfather",
    id: "190",
    parent: null,
    children: null,
  },
];

describe("sortComments()", () => {
  it("nests comments correctly.", () => {
    const result = sortComments(comments);

    expect(result).toHaveLength(2);

    expect(result[0].children[0]).toHaveProperty("name", "father");
    expect(result[0].children[0].children[0]).toHaveProperty("name", "child");
    expect(result[0].children[0].children[0].children[0].name).toMatch(/pet/);
  });

  it("sibling comments are in descending order.", () => {
    const result = sortComments(comments);

    expect(result[0].children[0].children[0].children[0]).toHaveProperty(
      "name",
      "other pet"
    );
  });
});
