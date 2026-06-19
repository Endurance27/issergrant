/// <reference types="cypress" />

interface Users {
  admin: { email: string; password: string };
  researcher: { email: string; password: string };
  financeOfficer: { email: string; password: string };
  director: { email: string; password: string };
  assistantResearcher: { email: string; password: string };
}

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays the login page with all required fields', () => {
    cy.get('[data-testid="email-input"]').should('exist').and('be.visible');
    cy.get('[data-testid="password-input"]').should('exist').and('be.visible');
    cy.get('[data-testid="login-button"]').should('exist').and('be.visible');
  });

  it('has the correct input types', () => {
    cy.get('[data-testid="email-input"]').should('have.attr', 'type', 'email');
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="login-button"]').should('have.attr', 'type', 'submit');
  });

  it('shows a validation error for invalid credentials', () => {
    cy.intercept('POST', '**/graphql').as('loginAttempt');

    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword123');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginAttempt');

    cy.get('[data-testid="login-error"]').should('be.visible');
  });

  it('redirects away from /login on successful login', () => {
    cy.fixture<Users>('users').then((users) => {
      cy.intercept('POST', '**/graphql').as('loginAttempt');

      cy.get('[data-testid="email-input"]').type(users.admin.email);
      cy.get('[data-testid="password-input"]').type(users.admin.password);
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginAttempt');
      cy.url().should('not.include', '/login');
    });
  });
});
