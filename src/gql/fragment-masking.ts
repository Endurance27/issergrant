import { DocumentNode, FragmentDefinitionNode } from 'graphql';

// FragmentType maps a fragment document to the shape of the data it selects
export type FragmentType<TDocumentType extends DocumentNode> =
  TDocumentType extends DocumentNode & {
    definitions: ReadonlyArray<infer TDef>;
  }
    ? TDef extends FragmentDefinitionNode
      ? { ' $fragmentRefs': Record<TDef['name']['value'], unknown> }
      : never
    : never;

/**
 * useFragment — unwraps a masked fragment from its parent data.
 * In code-gen scenarios this would be generated; here it's a lightweight passthrough.
 */
export function useFragment<TType>(
  _fragmentDoc: DocumentNode,
  fragmentRef: TType,
): TType {
  return fragmentRef;
}
