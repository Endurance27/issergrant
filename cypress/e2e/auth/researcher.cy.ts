/// <reference types="cypress" />

interface Users {
  researcher: { email: string; password: string };
}

describe('Researcher Authentication', () => {
  beforeEach(() => {
    cy.fixture<Users>('users').then((users) => {
      cy.session(
        ['researcher', users.researcher.email],
        () => {
          cy.login(users.researcher.email, users.researcher.password);
        },
        {
          validate() {
            cy.window()
              .its('localStorage')
              .invoke('getItem', 'auth-storage')
              .should('exist');
          },
        }
      );
      cy.visit('/researcher/dashboard');
      cy.url().should('not.include', '/login');
    });
  });

  it('redirects to the researcher dashboard after login', () => {
    cy.url().should('include', '/researcher');
  });

  it('renders the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('shows the Proposals menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Proposals').should('be.visible');
  });

  it('shows the Grant Calls menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Grant Calls').should('be.visible');
  });

  it('shows the Reports menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Reports').should('be.visible');
  });

  it('renders the research hub heading', () => {
    cy.contains('My Research Hub').should('be.visible');
  });
});
