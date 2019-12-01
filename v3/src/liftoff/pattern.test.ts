import { def, trace } from "./pattern";
import { str, int } from "./ref";

describe("patterns — ", () => {
  it("trace(plan) returns all bonds linked by plan()", () => {
    const name = str`name for testing`();
    const count = int`count for testing`();
    const delta = trace(() => {
      def(name)("hello world");
      def(name)(name);

      def(count)(1);
      def(count)(10);
    });

    expect(delta).toMatchInlineSnapshot(`
      Array [
        Object {
          "bond": Object {
            "key": DepKey {
              "deps": Array [],
              "site": Array [],
            },
            "rval": "hello world",
            "state": Object {
              "def": "hello world",
              "ref": Scalar {
                "defaultValue": undefined,
                "label": "name for testing",
              },
            },
            "type": "def",
          },
          "mut": "add",
        },
        Object {
          "bond": Object {
            "key": DepKey {
              "deps": Array [],
              "site": Array [],
            },
            "rval": Scalar {
              "defaultValue": undefined,
              "label": "name for testing",
            },
            "state": Object {
              "def": Scalar {
                "defaultValue": undefined,
                "label": "name for testing",
              },
              "ref": Scalar {
                "defaultValue": undefined,
                "label": "name for testing",
              },
            },
            "type": "def",
          },
          "mut": "add",
        },
        Object {
          "bond": Object {
            "key": DepKey {
              "deps": Array [],
              "site": Array [],
            },
            "rval": 1,
            "state": Object {
              "def": 1,
              "ref": Scalar {
                "defaultValue": undefined,
                "label": "count for testing",
              },
            },
            "type": "def",
          },
          "mut": "add",
        },
        Object {
          "bond": Object {
            "key": DepKey {
              "deps": Array [],
              "site": Array [],
            },
            "rval": 10,
            "state": Object {
              "def": 10,
              "ref": Scalar {
                "defaultValue": undefined,
                "label": "count for testing",
              },
            },
            "type": "def",
          },
          "mut": "add",
        },
      ]
    `);
  });
});
