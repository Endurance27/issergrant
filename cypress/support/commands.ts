/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      graphql(query: string, variables?: Record<string, unknown>): Chainable<Cypress.Response<unknown>>;
    }
  }
}

const GRAPHQL_URL = 'http://197.255.123.247/graphql';

Cypress.Commands.add('graphql', (query: string, variables = {}) => {
  cy.request({
    method: 'POST',
    url: GRAPHQL_URL,
    body: { query, variables },
    headers: { 'Content-Type': 'application/json' },
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.intercept('POST', '**/graphql').as('signInMutation');
  cy.get('[data-testid="login-button"]').click();
  cy.wait('@signInMutation');
  cy.url().should('not.include', '/login');
});
