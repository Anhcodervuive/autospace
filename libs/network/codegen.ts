import type { CodegenConfig } from '@graphql-codegen/cli';

const documentsPattern = '**/*.graphql';

const plugins = [
    'typescript',
    'typescript-operations',
    'typed-document-node',
    'named-operations-object',
]

const config: CodegenConfig = {
    overwrite: true,
    schema: '../../apps/api/src/schema.gql',
    // watch: true,
    generates: {
        './src/gql/generated.tsx': {
            documents: `./src/${documentsPattern}`,
            plugins,
        },
    },
}

export default config;