// import type { CodegenConfig } from '@graphql-codegen/cli';

// const config: CodegenConfig = {
//   overwrite: true,
//   schema: 'http://localhost:8095/graphql',
//   documents: ['src/**/*.ts', 'src/**/*.tsx'],
//   generates: {
//     'src/gql/': {
//       preset: 'client',
//       plugins: [],
//       presetConfig: {
//         // Keep fragment masking off — the project imports raw document nodes
//         fragmentMasking: false,
//       },
//     },
//   },
//   // Don't error when no operations are found in a document
//   ignoreNoDocuments: true,
// };

// export default config;

import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8095/graphql',
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      documents: ['src/**/*.ts', 'src/**/*.tsx'],
      preset: 'client',
      plugins: [],
    },
    './src/gql/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
