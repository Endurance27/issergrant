import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  CombinedGraphQLErrors,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorLink } from "@apollo/client/link/error";
import React from "react";
import { useAuthStore } from "../store/auth.store";

// const GRAPHQL_URI =
//   import.meta.env.VITE_GRAPHQL_URL ??
//   (import.meta.env.PROD ? "/api/graphql" : " https://grants.isser.edu.gh");

const GRAPHQL_URI = "https://grants.isser.edu.gh/graphql";

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
});

/**
 * Auth link — reads the access token directly from the Zustand store's
 * persisted localStorage entry on every request so it is always current.
 *
 * We read from the store state (not a React hook) because Apollo links run
 * outside of the React render cycle. `useAuthStore.getState()` is the
 * Zustand escape-hatch for imperative / non-hook access.
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = useAuthStore.getState().accessToken;
  operation.setContext(
    ({ headers = {} }: { headers?: Record<string, string> }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
  );
  return forward(operation);
});

/**
 * Error link — logs GraphQL and network errors to the console.
 * In production this could be replaced with a Sentry/Datadog reporter.
 */
const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

interface ApolloClientProviderProps {
  children: React.ReactNode;
}

export function ApolloClientProvider({ children }: ApolloClientProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
