import gql from 'graphql-tag';
import { execute } from '../execution-utils';

import * as accounts from '../__fixtures__/schemas/accounts';
import * as books from '../__fixtures__/schemas/books';
import * as inventory from '../__fixtures__/schemas/inventory';
import * as product from '../__fixtures__/schemas/product';
import * as reviews from '../__fixtures__/schemas/reviews';

import { astSerializer, queryPlanSerializer } from '../../snapshotSerializers';

expect.addSnapshotSerializer(astSerializer);
expect.addSnapshotSerializer(queryPlanSerializer);

describe('custom executable directives', () => {
  it('passes directives along in requests to underlying services', async () => {
    const query = gql`
      query GetReviewers {
        topReviews {
          body @stream
        }
      }
    `;

    const { data, errors, queryPlan } = await execute(
      [accounts, books, inventory, product, reviews],
      {
        query,
      },
    );

    expect(errors).toBeUndefined();
    expect(queryPlan).toCallService('reviews');
    expect(queryPlan).toMatchInlineSnapshot(`
      QueryPlan {
        Fetch(service: "reviews") {
          {
            topReviews {
              body @stream
            }
          }
        },
      }
    `);
  });

  it("returns validation errors when directives aren't present across all services", async () => {
    const invalidService = {
      name: 'invalidService',
      typeDefs: gql`
        directive @invalid on QUERY
      `,
    };

    const query = gql`
      query GetReviewers {
        topReviews {
          body @stream
        }
      }
    `;

    expect(
      execute([accounts, books, inventory, product, reviews, invalidService], {
        query,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
"[@stream] -> Custom directives must be implemented in every service. The following services do not implement the @stream directive: invalidService.

[@invalid] -> Custom directives must be implemented in every service. The following services do not implement the @invalid directive: accounts, books, inventory, product, reviews."
`);
  });

  it("returns validation errors when directives aren't identical across all services", async () => {
    const invalidService = {
      name: 'invalid',
      typeDefs: gql`
        directive @stream on QUERY
      `,
    };

    const query = gql`
      query GetReviewers {
        topReviews {
          body @stream
        }
      }
    `;

    expect(
      execute([accounts, books, inventory, product, reviews, invalidService], {
        query,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
"[@stream] -> custom directives must be defined identically across all services. See below for a list of current implementations:
	accounts: directive @stream on FIELD
	books: directive @stream on FIELD
	inventory: directive @stream on FIELD
	product: directive @stream on FIELD
	reviews: directive @stream on FIELD
	invalid: directive @stream on QUERY"
`);
  });
});
