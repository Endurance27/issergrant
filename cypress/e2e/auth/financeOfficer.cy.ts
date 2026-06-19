/// <reference types="cypress" />

interface Users {
  financeOfficer: { email: string; password: string };
}

describe('Finance Officer Authentication', () => {
  beforeEach(() => {
    cy.fixture<Users>('users').then((users) => {
      cy.session(
        ['financeOfficer', users.financeOfficer.email],
        () => {
          cy.login(users.financeOfficer.email, users.financeOfficer.password);
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
      cy.visit('/finance/dashboard');
      cy.url().should('not.include', '/login');
    });
  });

  it('redirects to the finance dashboard after login', () => {
    cy.url().should('include', '/finance');
  });

  it('renders the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('shows the Awards & Funding menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Awards & Funding').should('be.visible');
  });

  it('shows the Reports menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Reports').should('be.visible');
  });

  it('shows the Analytics menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Analytics').should('be.visible');
  });

  it('renders the financial overview heading', () => {
    cy.contains('Financial Overview').should('be.visible');
  });
});
