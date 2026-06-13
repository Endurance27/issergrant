/// <reference types="cypress" />

// Backend GraphQL endpoint used by the app
const GQL = '**/graphql';

interface Users {
  admin: { email: string; password: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function interceptGetUsers(
  alias = 'getUsers',
  response?: Cypress.RouteMatcherOptions | object,
) {
  cy.intercept('POST', GQL, (req) => {
    if (
      req.body?.operationName === 'GetUsers' ||
      (typeof req.body?.query === 'string' && /\bGetUsers\b/.test(req.body.query))
    ) {
      req.alias = alias;
      if (response) req.reply(response as Cypress.StaticResponse);
    } else {
      req.continue();
    }
  });
}

function loginAsAdmin() {
  cy.fixture<Users>('users').then((users) => {
    cy.session(['admin-users-page', users.admin.email], () => {
      cy.login(users.admin.email, users.admin.password);
    });
  });
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('Admin — User Management', () => {
  beforeEach(() => {
    loginAsAdmin();
  });

  // ── Success: live data ─────────────────────────────────────────────────────

  describe('with live backend data', () => {
    beforeEach(() => {
      interceptGetUsers();
      cy.visit('/admin/users');
      cy.wait('@getUsers');
    });

    it('issues a GetUsers GraphQL query when navigating to User Management', () => {
      // The cy.wait above already asserted the request was made
      cy.get('[data-testid="users-table"]').should('exist');
    });

    it('renders at least one user row', () => {
      cy.get('[data-testid="user-row"]').should('have.length.greaterThan', 0);
    });

    it('displays user names and emails in the rows', () => {
      cy.get('[data-testid="user-row"]')
        .first()
        .within(() => {
          // Name column contains non-empty text
          cy.get('td').eq(0).invoke('text').should('not.be.empty');
          // Email is rendered inside the first cell
          cy.get('td').eq(0).should('contain.text', '@');
        });
    });

    it('does not render any mock placeholder names', () => {
      // These were the dummy names in the old mock data array
      cy.contains('Dr. Sarah Ahmad').should('not.exist');
      cy.contains('Prof. James Okonkwo').should('not.exist');
      cy.contains('Dr. Layla Hassan').should('not.exist');
      cy.contains('Chen Wei').should('not.exist');
      cy.contains('Ms. Fatima Al-Rashid').should('not.exist');
      cy.contains('Dr. Marcus Rivera').should('not.exist');
      cy.contains('Amira Nour').should('not.exist');
      cy.contains('Dr. Raj Patel').should('not.exist');
    });
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('shows the loading skeleton while the GetUsers request is in flight', () => {
      // Delay the response by 2 seconds so the skeleton stays visible long enough
      interceptGetUsers('getUsers', {
        delay: 2000,
        statusCode: 200,
        body: { data: { users: [{ id: '1', name: 'Test User', email: 'test@test.com', role: 'researcher', status: 'Active', department: 'Research', createdAt: '2025-01-01T00:00:00.000Z' }] } },
      });

      cy.visit('/admin/users');

      // Skeleton should be present before the response arrives
      cy.get('[data-testid="users-loading"]').should('exist');

      // After request resolves the skeleton disappears and the table shows
      cy.wait('@getUsers');
      cy.get('[data-testid="users-table"]').should('exist');
    });
  });

  // ── Error state ────────────────────────────────────────────────────────────

  describe('error state', () => {
    it('shows the error UI when the GraphQL request fails', () => {
      interceptGetUsers('getUsers', {
        statusCode: 200,
        body: {
          errors: [{ message: 'Unauthorized' }],
          data: null,
        },
      });

      cy.visit('/admin/users');
      cy.wait('@getUsers');

      cy.get('[data-testid="users-error"]').should('exist');
      cy.get('[data-testid="users-table"]').should('not.exist');
    });

    it('shows the error UI on a network-level failure', () => {
      interceptGetUsers('getUsers', { forceNetworkError: true });

      cy.visit('/admin/users');
      cy.wait('@getUsers');

      cy.get('[data-testid="users-error"]').should('exist');
    });
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('shows the empty state when the backend returns zero users', () => {
      interceptGetUsers('getUsers', {
        statusCode: 200,
        body: { data: { users: [] } },
      });

      cy.visit('/admin/users');
      cy.wait('@getUsers');

      cy.get('[data-testid="users-empty"]').should('exist');
      cy.get('[data-testid="users-table"]').should('not.exist');
    });
  });
});
