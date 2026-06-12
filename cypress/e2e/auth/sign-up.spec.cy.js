/// <reference types="cypress" />

/**
 * E2E: Admin signs up a new user via the "Add User" flow.
 *
 * In this app there is no public /signup route — new accounts are created
 * by an Admin from the User Management page. The mutation
 *   CREATE_USER_MUTATION (Apollo)
 * is invoked from useCreateUser, which calls the GraphQL endpoint configured
 * via VITE_GRAPHQL_URL (or cypress.env.json GRAPHQL_URL fallback).
 *
 * The mutation returns a one-time `temporaryPassword` that is shown to the
 * Admin in the TemporaryPasswordModal so it can be shared with the new user.
 *
 * Selectors use the accessible attributes already present in the components
 * (name on inputs, role/text on buttons) — no extra data-cy hooks required.
 */

/**
 * Log in as Admin using the real login form.
 * The beforeEach intercept stubs the sign-in mutation and sets req.alias='signIn',
 * so cy.wait('@signIn') resolves once the mocked response is received.
 */
function loginAsAdmin() {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type('admin@admin.com');
  cy.get('[data-testid="password-input"]').type('1234');
  cy.get('[data-testid="login-button"]').click();
  cy.wait('@signIn');
  cy.location('pathname', { timeout: 10000 }).should('eq', '/admin/dashboard');
}

describe('Admin user sign-up (Add User flow)', () => {
  beforeEach(() => {
    // Reset the auth state so no leftover session bleeds into this test.
    cy.clearCookies();
    cy.clearLocalStorage();

    // Stub the Supabase REST call that fetches users on mount of UserManagementPage.
    // Without this, a slow Supabase response can arrive after the first user is
    // added to local state and overwrite it, causing the duplicate-email guard to
    // miss the newly-created user.
    cy.intercept(
      'GET',
      'https://pavkifpdanbpnzlxoyqi.supabase.co/rest/v1/users*',
      { statusCode: 200, body: [] },
    ).as('fetchUsers');

    // Stub the createUser GraphQL mutation so the test is hermetic and
    // doesn't depend on a live backend. The stub mirrors the shape of the
    // real `createUser` resolver defined in src/gql/mutations/createUser.ts.
    cy.intercept('POST', '**/graphql', (req) => {
      const { body } = req;
      if (
        body?.operationName === 'CreateUser' ||
        /mutation\s+CreateUser\b/.test(body?.query ?? '')
      ) {
        const input = body?.variables?.input ?? {};
        req.alias = 'createUser';
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createUser: {
                temporaryPassword: 'Tmp#9kQ2xvR',
                user: {
                  id: 'new-user-001',
                  authUserId: 'auth-user-001',
                  avatar: input.name
                    ? input.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'NU',
                  lastLogin: null,
                },
              },
            },
          },
        });
        return;
      }

      // Stub the sign-in mutation so login is hermetic.
      if (
        body?.operationName === 'SignIn' ||
        /mutation.*\bsignIn\b/i.test(body?.query ?? '')
      ) {
        req.alias = 'signIn';
        req.reply({
          statusCode: 200,
          body: {
            data: {
              signIn: {
                id: 'admin-001',
                email: 'admin@admin.com',
                account_type: 'admin',
                accessToken: 'mock-admin-token',
              },
            },
          },
        });
        return;
      }

      // Pass through any other GraphQL calls (e.g. users list fetch).
      req.continue();
    }).as('graphql');
  });

  it('should sign in as Admin and land on the admin dashboard', () => {
    loginAsAdmin();
  });

  it('should allow an Admin to sign up a new Researcher and show the temporary password', () => {
    loginAsAdmin();

    // --- Navigate to User Management ---------------------------------------
    cy.contains('button', 'Team Members').click();
    cy.location('pathname').should('eq', '/admin/users');

    // --- Open the Add User modal -------------------------------------------
    cy.contains('button', 'Add User').click();

    // Modal title is rendered by the Modal component as an <h2>.
    cy.get('h2').contains('Add New User').should('be.visible');

    // --- Fill the form ------------------------------------------------------
    const newUser = {
      name: 'Ama Boateng',
      email: `ama.boateng+${Date.now()}@iser.edu`,
      staffId: 'ISER-2042',
      phone: '+233 244 555 111',
    };

    cy.get('input[name="name"]').clear().type(newUser.name);
    cy.get('input[name="email"]').clear().type(newUser.email);
    cy.get('input[name="staffId"]').clear().type(newUser.staffId);
    cy.get('input[name="phoneContact"]').clear().type(newUser.phone);
    // Role is restricted to ['Researcher', 'Finance Officer'] by the page.
    cy.get('select[name="role"]').select('Researcher');

    // --- Submit and wait for the GraphQL mutation --------------------------
    cy.contains('button', 'Create User').click();
    cy.wait('@createUser');

    // --- Assert: the TemporaryPasswordModal appears with the temp password
    cy.get('h2').contains('User Created Successfully').should('be.visible');
    cy.contains('Ama Boateng').should('be.visible');
    cy.contains(newUser.email).should('be.visible');
    cy.contains('Tmp#9kQ2xvR').should('be.visible');

    // Close the modal and assert the new user is in the table.
    cy.contains('button', 'Close').click();

    // The table renders the new user's name + email in a single <tr>.
    cy.contains('tr', newUser.name).within(() => {
      cy.contains(newUser.email).should('be.visible');
      cy.contains('Researcher').should('be.visible');
      cy.contains('Active').should('be.visible');
    });
  });

  it('should reject a duplicate email with a friendly error', () => {
    const existingEmail = `existing+${Date.now()}@iser.edu`;

    loginAsAdmin();

    cy.contains('button', 'Team Members').click();
    cy.location('pathname').should('eq', '/admin/users');

    cy.contains('button', 'Add User').click();
    cy.get('input[name="name"]').type('First Try');
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="staffId"]').type('ISER-1001');
    cy.get('input[name="phoneContact"]').type('+233 200 000 000');
    cy.contains('button', 'Create User').click();
    cy.wait('@createUser');

    cy.get('h2').contains('User Created Successfully').should('be.visible');
    cy.contains('button', 'Close').click();

    // Second attempt with the same email — the page-level guard should fire
    // BEFORE the mutation is dispatched.
    cy.contains('button', 'Add User').click();
    cy.get('input[name="name"]').type('Second Try');
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="staffId"]').type('ISER-1002');
    cy.get('input[name="phoneContact"]').type('+233 200 000 001');
    cy.contains('button', 'Create User').click();

    cy.contains('A user with this email already exists.').should('be.visible');
  });

  it('should show validation errors for required fields', () => {
    loginAsAdmin();

    cy.contains('button', 'Team Members').click();
    cy.location('pathname').should('eq', '/admin/users');

    cy.contains('button', 'Add User').click();

    // Touch each required field by typing then clearing, then blur.
    const requiredFields = [
      { name: 'name', message: 'Full name is required' },
      { name: 'email', message: 'Email is required' },
      { name: 'staffId', message: 'Staff ID is required' },
      { name: 'phoneContact', message: 'Phone contact is required' },
    ];

    requiredFields.forEach(({ name, message }) => {
      cy.get(`input[name="${name}"]`).type('x');
      cy.get(`input[name="${name}"]`).clear();
      cy.get(`input[name="${name}"]`).blur();
      // The error is rendered as a <p> right under the input.
      cy.contains('p', message).should('be.visible');
    });
  });

  it('should show an invalid-email error when the email format is wrong', () => {
    loginAsAdmin();

    cy.contains('button', 'Team Members').click();
    cy.location('pathname').should('eq', '/admin/users');

    cy.contains('button', 'Add User').click();
    cy.get('input[name="name"]').type('Bad Email User');
    cy.get('input[name="email"]').type('not-an-email').blur();

    // The error should appear immediately after blur, before filling other fields.
    cy.contains('p', 'Invalid email address').should('be.visible');
  });
});
