/// <reference types="cypress" />

interface Users {
  admin: { email: string; password: string };
}

describe('Admin Authentication', () => {
  beforeEach(() => {
    cy.fixture<Users>('users').then((users) => {
      cy.session(
        ['admin', users.admin.email],
        () => {
          cy.login(users.admin.email, users.admin.password);
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
      cy.visit('/admin/dashboard');
      cy.url().should('not.include', '/login');
    });
  });

  it('redirects to the admin dashboard after login', () => {
    cy.url().should('include', '/admin');
  });

  it('renders the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('shows the User Management menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Team Members').should('be.visible');
  });

  it('shows the Grant Calls menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Grant Calls').should('be.visible');
  });

  it('shows the Audit Logs menu item', () => {
    // Audit Logs sits near the bottom of the scrollable sidebar nav; scroll it
    // into view so the visibility assertion passes at any viewport height.
    cy.get('[data-testid="sidebar"]').contains('Audit Logs').scrollIntoView().should('be.visible');
  });

  it('renders dashboard content', () => {
    cy.contains('System Overview').should('be.visible');
  });
});
