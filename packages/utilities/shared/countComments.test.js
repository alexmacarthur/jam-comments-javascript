import countComments from "./countComments";

describe("countComments()", () => {
  it("counts deeply nested comments", () => {
    const comments = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [
              {
                id: 3,
                children: [
                  {
                    id: 4,
                  },
                ],
              },
            ],
          },
          {
            id: 5,
          },
          {
            id: 6,
          },
        ],
      },
    ];

    const result = countComments(comments);

    expect(result).toEqual(6);
  });

  it("counts shallow comments", () => {
    const comments = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const result = countComments(comments);

    expect(result).toEqual(3);
  });

  it("counts single nested comment + children", () => {
    const comments = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [
              {
                id: 3,
                children: [
                  {
                    id: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const result = countComments(comments);

    expect(result).toEqual(4);
  });
});
