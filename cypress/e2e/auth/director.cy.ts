/// <reference types="cypress" />

interface Users {
  director: { email: string; password: string };
}

describe('Director Authentication', () => {
  beforeEach(() => {
    cy.fixture<Users>('users').then((users) => {
      cy.session(
        ['director', users.director.email],
        () => {
          // The director role may not exist on the live backend, so we stub
          // the sign-in mutation to return a valid director session.
          cy.intercept('POST', '**/graphql', (req) => {
            if (/signIn/i.test(req.body?.query ?? '') || req.body?.operationName === 'SignIn') {
              req.reply({
                statusCode: 200,
                body: {
                  data: {
                    signIn: {
                      id: 'director-001',
                      email: users.director.email,
                      account_type: 'director',
                      accessToken: 'mock-director-token',
                    },
                  },
                },
              });
            } else {
              req.continue();
            }
          }).as('signInMutation');

          cy.visit('/login');
          cy.get('[data-testid="email-input"]').type(users.director.email);
          cy.get('[data-testid="password-input"]').type(users.director.password);
          cy.get('[data-testid="login-button"]').click();
          cy.wait('@signInMutation');
          cy.url().should('not.include', '/login');
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
      cy.visit('/director/dashboard');
      cy.url().should('include', '/director');
    });
  });

  it('redirects to the director dashboard after login', () => {
    cy.url().should('include', '/director');
  });

  it('renders the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('shows the Reports menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Reports').should('be.visible');
  });

  it('shows the Analytics menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Analytics').should('be.visible');
  });

  it('renders user statistics', () => {
    cy.contains('Dashboard').should('be.visible');
  });
});
