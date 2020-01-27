import { specifiedSDLRules } from 'graphql/validation/specifiedRules';

/**
 * Since this module has overlapping names in the two modules (graphql-js and
 * our own, local validation rules) which we are importing from, we
 * intentionally are very explicit about the suffixes of imported members here,
 * so that the intention is clear.
 *
 * First, we'll import validation rules from graphql-js which we'll omit and
 * replace with our own validation rules. As noted above, we'll use aliases
 * with 'FromGraphqlJs' suffixes for clarity.
 */

import {
  UniqueDirectivesPerLocationRule as UniqueDirectivesPerLocationFromGraphqlJs,
  UniqueTypeNamesRule as UniqueTypeNamesFromGraphqlJs,
  UniqueEnumValueNamesRule as UniqueEnumValueNamesFromGraphqlJs,
  PossibleTypeExtensionsRule as PossibleTypeExtensionsFromGraphqlJs,
  UniqueFieldDefinitionNamesRule as UniqueFieldDefinitionNamesFromGraphqlJs,
} from 'graphql/validation';

/**
 * Then, we'll import our own validation rules to take the place of those that
 * we'll be customizing, taking care to alias them all to the same name with
 * "FromComposition" suffixes.
 */
import {
  UniqueTypeNamesWithFields as UniqueTypeNamesWithFieldsFromComposition,
  MatchingEnums as MatchingEnumsFromComposition,
  PossibleTypeExtensions as PossibleTypeExtensionsFromComposition,
  UniqueFieldDefinitionNames as UniqueFieldDefinitionsNamesFromComposition,
  UniqueUnionTypes as UniqueUnionTypesFromComposition,
 } from './validate/sdl';

const omit = [
  UniqueDirectivesPerLocationFromGraphqlJs,
  UniqueTypeNamesFromGraphqlJs,
  UniqueEnumValueNamesFromGraphqlJs,
  PossibleTypeExtensionsFromGraphqlJs,
  UniqueFieldDefinitionNamesFromGraphqlJs,
];

export const compositionRules = specifiedSDLRules
  .filter(rule => !omit.includes(rule))
  .concat([
    UniqueFieldDefinitionsNamesFromComposition,
    UniqueTypeNamesWithFieldsFromComposition,
    MatchingEnumsFromComposition,
    UniqueUnionTypesFromComposition,
    PossibleTypeExtensionsFromComposition,
  ]);
