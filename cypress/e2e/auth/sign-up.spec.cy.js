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

describe('Admin user sign-up (Add User flow)', () => {
  beforeEach(() => {
    // Reset the auth state so the Supabase session from a previous run
    // doesn't bypass the login form.
    cy.clearCookies()
    cy.clearLocalStorage()

    // Stub the createUser GraphQL mutation so the test is hermetic and
    // doesn't depend on a live backend. The stub mirrors the shape of the
    // real `createUser` resolver defined in src/gql/mutations/createUser.ts.
    cy.intercept('POST', '**/graphql', (req) => {
      const { body } = req
      if (
        body?.operationName === 'CreateUser' ||
        /mutation\s+CreateUser\b/.test(body?.query ?? '')
      ) {
        const input = body?.variables?.input ?? {}
        req.alias = 'createUser'
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
        })
        return
      }
      // Pass through any unrelated GraphQL calls (e.g. the initial users fetch).
      req.continue()
    }).as('graphql')
  })

  it('should sign in as Admin and land on the admin dashboard', () => {
    cy.visit('/login')

    // The LoginPage has a quick-demo section with role buttons. Click the "Admin" one.
    cy.contains('button', 'Admin').click()

    cy.location('pathname', { timeout: 10000 }).should('eq', '/admin/dashboard')
  })

  it('should allow an Admin to sign up a new Researcher and show the temporary password', () => {
    // --- Sign in as Admin ---------------------------------------------------
    cy.visit('/login')
    cy.contains('button', 'Admin').click()
    cy.location('pathname').should('eq', '/admin/dashboard')

    // --- Navigate to User Management ---------------------------------------
    cy.contains('button', 'Team Members').click()
    cy.location('pathname').should('eq', '/admin/users')

    // --- Open the Add User modal -------------------------------------------
    cy.contains('button', 'Add User').click()

    // Modal title is rendered by the Modal component as an <h2>.
    cy.get('h2').contains('Add New User').should('be.visible')

    // --- Fill the form ------------------------------------------------------
    const newUser = {
      name: 'Ama Boateng',
      email: `ama.boateng+${Date.now()}@iser.edu`,
      staffId: 'ISER-2042',
      phone: '+233 244 555 111',
    }

    cy.get('input[name="name"]').clear().type(newUser.name)
    cy.get('input[name="email"]').clear().type(newUser.email)
    cy.get('input[name="staffId"]').clear().type(newUser.staffId)
    cy.get('input[name="phoneContact"]').clear().type(newUser.phone)
    // Role is restricted to ['Researcher', 'Finance Officer'] by the page.
    cy.get('select[name="role"]').select('Researcher')

    // --- Submit and wait for the GraphQL mutation --------------------------
    cy.contains('button', 'Create User').click()
    cy.wait('@createUser')

    // --- Assert: the TemporaryPasswordModal appears with the temp password
    cy.get('h2').contains('User Created Successfully').should('be.visible')
    cy.contains('Ama Boateng').should('be.visible')
    cy.contains(newUser.email).should('be.visible')
    cy.contains('Tmp#9kQ2xvR').should('be.visible')

    // Close the modal and assert the new user is in the table.
    cy.contains('button', 'Close').click()

    // The table renders the new user's name + email in a single <tr>.
    cy.contains('tr', newUser.name).within(() => {
      cy.contains(newUser.email).should('be.visible')
      cy.contains('Researcher').should('be.visible')
      cy.contains('Active').should('be.visible')
    })
  })

  it('should reject a duplicate email with a friendly error', () => {
    const existingEmail = `existing+${Date.now()}@iser.edu`

    // Sign in and create the first user.
    cy.visit('/login')
    cy.contains('button', 'Admin').click()
    cy.location('pathname').should('eq', '/admin/dashboard')

    cy.contains('button', 'Team Members').click()
    cy.location('pathname').should('eq', '/admin/users')

    cy.contains('button', 'Add User').click()
    cy.get('input[name="name"]').type('First Try')
    cy.get('input[name="email"]').type(existingEmail)
    cy.get('input[name="staffId"]').type('ISER-1001')
    cy.get('input[name="phoneContact"]').type('+233 200 000 000')
    cy.contains('button', 'Create User').click()
    cy.wait('@createUser')

    cy.get('h2').contains('User Created Successfully').should('be.visible')
    cy.contains('button', 'Close').click()

    // Second attempt with the same email — the page-level guard should fire
    // BEFORE the mutation is dispatched.
    cy.contains('button', 'Add User').click()
    cy.get('input[name="name"]').type('Second Try')
    cy.get('input[name="email"]').type(existingEmail)
    cy.get('input[name="staffId"]').type('ISER-1002')
    cy.get('input[name="phoneContact"]').type('+233 200 000 001')
    cy.contains('button', 'Create User').click()

    cy.contains('A user with this email already exists.').should('be.visible')
  })

  it('should show validation errors for required fields', () => {
    cy.visit('/login')
    cy.contains('button', 'Admin').click()
    cy.location('pathname').should('eq', '/admin/dashboard')

    cy.contains('button', 'Team Members').click()
    cy.location('pathname').should('eq', '/admin/users')

    cy.contains('button', 'Add User').click()

    // Touch each required field by typing then clearing, then blur.
    const requiredFields = [
      { name: 'name', message: 'Full name is required' },
      { name: 'email', message: 'Email is required' },
      { name: 'staffId', message: 'Staff ID is required' },
      { name: 'phoneContact', message: 'Phone contact is required' },
    ]

    requiredFields.forEach(({ name, message }) => {
      cy.get(`input[name="${name}"]`).type('x')
      cy.get(`input[name="${name}"]`).clear()
      cy.get(`input[name="${name}"]`).blur()
      // The error is rendered as a <p> right under the input.
      cy.contains('p', message).should('be.visible')
    })
  })

  it('should show an invalid-email error when the email format is wrong', () => {
    cy.visit('/login')
    cy.contains('button', 'Admin').click()
    cy.location('pathname').should('eq', '/admin/dashboard')

    cy.contains('button', 'Team Members').click()
    cy.location('pathname').should('eq', '/admin/users')

    cy.contains('button', 'Add User').click()
    cy.get('input[name="name"]').type('Bad Email User')
    cy.get('input[name="email"]').type('not-an-email').blur()

    // The error should appear immediately after blur, before filling other fields.
    cy.contains('p', 'Invalid email address').should('be.visible')
  })
})
