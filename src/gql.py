from gql import gql as _gql
from typing import Tuple
from graphql import print_ast, DocumentNode, FragmentDefinitionNode, DefinitionNode


def deduplicate_fragments(
    definitions: Tuple[DefinitionNode, ...]
) -> Tuple[DefinitionNode]:

    fragment_names = []
    dedup_definitions = []

    for definition in definitions:
        if isinstance(definition, FragmentDefinitionNode):
            fragment_name = definition.name.value

            if fragment_name not in fragment_names:
                fragment_names.append(fragment_name)
                dedup_definitions.append(definition)
        else:
            dedup_definitions.append(definition)

    return tuple(dedup_definitions)


def gql(*args):
    texts = [print_ast(arg) if isinstance(arg, DocumentNode) else arg for arg in args]
    document = _gql("\n".join(texts))
    document.definitions = deduplicate_fragments(document.definitions)
    return document
