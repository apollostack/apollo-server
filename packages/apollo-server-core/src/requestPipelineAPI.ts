// This file is compiled as a separate TypeScript project to avoid
// circular dependency issues from the `apollo-server-plugin-base` package
// depending on the types in it.

import { Request, Response } from 'apollo-server-env';
import {
  GraphQLSchema,
  ValidationContext,
  ASTVisitor,
  GraphQLError,
  OperationDefinitionNode,
  DocumentNode,
} from 'graphql';
import { KeyValueCache } from 'apollo-server-caching';

export interface GraphQLServiceContext {
  schema: GraphQLSchema;
  schemaHash: string;
  engine: {
    serviceID?: string;
  };
  persistedQueries?: {
    cache: KeyValueCache;
  };
}

export interface GraphQLRequest {
  query?: string;
  operationName?: string;
  variables?: { [name: string]: any };
  extensions?: Record<string, any>;
  http?: Pick<Request, 'url' | 'method' | 'headers'>;
}

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
  http?: Pick<Response, 'headers'>;
}

export interface GraphQLRequestMetrics {
  persistedQueryHit?: boolean;
  persistedQueryRegister?: boolean;
  // XXX I thought about making this an augmentation either from
  // apollo-engine-reporting or apollo-server-plugin-response-cache but that
  // seemed to mean that one of those packages would have to depend on the
  // other, which seemed wrong.  Happy to hear there's a better way.
  responseCacheHit?: boolean;
}

export interface GraphQLRequestContext<TContext = Record<string, any>> {
  readonly request: GraphQLRequest;
  readonly response?: GraphQLResponse;

  readonly context: TContext;
  readonly cache: KeyValueCache;

  // This will be replaced with the `operationID`.
  readonly queryHash?: string;

  readonly document?: DocumentNode;
  readonly source?: string;

  // `operationName` is set based on the operation AST, so it is defined
  // even if no `request.operationName` was passed in.
  // It will be set to `null` for an anonymous operation.
  readonly operationName?: string | null;
  readonly operation?: OperationDefinitionNode;

  readonly metrics?: GraphQLRequestMetrics;

  debug?: boolean;
}

export type ValidationRule = (context: ValidationContext) => ASTVisitor;

export class InvalidGraphQLRequestError extends Error {}
