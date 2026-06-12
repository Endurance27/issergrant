/// <reference types="cypress" />

// Route for assistant_researcher role: /assistant/dashboard
// The backend enum value is "assistant_researcher"; ROLE_BASE_PATH maps it to /assistant.

interface Users {
  assistantResearcher: { email: string; password: string };
}

describe('Assistant Researcher Authentication', () => {
  beforeEach(() => {
    cy.fixture<Users>('users').then((users) => {
      cy.session(
        ['assistantResearcher', users.assistantResearcher.email],
        () => {
          cy.login(users.assistantResearcher.email, users.assistantResearcher.password);
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
      cy.visit('/assistant/dashboard');
      cy.url().should('not.include', '/login');
    });
  });

  it('redirects to the assistant researcher dashboard after login', () => {
    cy.url().should('include', '/assistant');
  });

  it('renders the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('shows the Proposals menu item', () => {
    cy.get('[data-testid="sidebar"]').contains('Proposals').should('be.visible');
  });

  it('renders the team workspace heading', () => {
    cy.contains('Team Workspace').should('be.visible');
  });
});
