/// <reference types="cypress" />

// A proposal is no longer limited to a single Co-PI — these tests cover the
// multi-select Co-PI picker on the Create Proposal form: single Co-PI,
// multiple Co-PIs, no Co-PIs, duplicate prevention, and self-exclusion.

const GQL = '**/graphql';

interface Users {
  researcher: { email: string; password: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function interceptGql(
  operationName: string,
  alias: string,
  response: Cypress.RouteMatcherOptions | object,
) {
  cy.intercept('POST', GQL, (req) => {
    if (
      req.body?.operationName === operationName ||
      (typeof req.body?.query === 'string' && new RegExp(`\\b${operationName}\\b`).test(req.body.query))
    ) {
      req.alias = alias;
      req.reply(response as Cypress.StaticResponse);
    } else {
      req.continue();
    }
  });
}

function loginAsResearcher() {
  cy.fixture<Users>('users').then((users) => {
    cy.session(['researcher-create-proposal', users.researcher.email], () => {
      cy.login(users.researcher.email, users.researcher.password);
    });
  });
}

/** Pulls the logged-in user's id out of the persisted Zustand auth store. */
function getCurrentUserId(): Cypress.Chainable<string> {
  return cy.window().then((win) => {
    const raw = win.localStorage.getItem('auth-storage');
    const parsed = raw ? JSON.parse(raw) : null;
    return (parsed?.state?.user?.UserId ?? '') as string;
  });
}

const FUNDING_CALL = {
  id: 'fc-1',
  funder: 'Test Foundation',
  theme: 'Climate Resilience Research',
  description: 'desc',
  openDate: '2025-01-01',
  status: 'Open',
  totalAvailable: 500000,
  maximumAward: 100000,
  minimumAward: null,
  hasMinMaxAward: false,
  allowsMultipleApplications: 'yes',
  originalCallLink: '',
  eligibility: [],
  createdBy: 'admin-1',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

// Includes the currently-logged-in researcher under a name that must never
// surface in the picker — proves self-exclusion is keyed on id, not name.
function fakeResearchers(selfId: string) {
  return [
    { id: 'res-aaa', name: 'Dr. Ama Boateng', email: 'ama@iser.edu', department: 'Public Finance', status: 'active' },
    { id: 'res-bbb', name: 'Dr. Kojo Mensah', email: 'kojo@iser.edu', department: 'Education', status: 'active' },
    { id: selfId, name: 'SELF-SHOULD-NOT-APPEAR', email: 'self@iser.edu', department: 'Health', status: 'active' },
  ];
}

function fakeProposal(selfId: string, coPIs: { id: string; name: string; email: string; department: string }[]) {
  return {
    id: 'p-1',
    title: 'Smart Grid Optimization Using Machine Learning',
    abstract: 'A'.repeat(60),
    status: 'submitted',
    requestedAmount: 120000,
    submittedAt: '2025-01-01T09:30:00.000Z',
    user: { id: selfId, name: 'Me', email: 'me@iser.edu', department: 'Macroeconomic Policy' },
    coPIs,
    fundingCall: FUNDING_CALL,
  };
}

function openCreateForm(researchers: ReturnType<typeof fakeResearchers>) {
  interceptGql('GetFundingCalls', 'getFundingCalls', {
    statusCode: 200,
    body: { data: { getFundingCalls: [FUNDING_CALL] } },
  });
  interceptGql('GetResearchers', 'getResearchers', {
    statusCode: 200,
    body: { data: { getUsersByRole: { users: researchers, totalCount: researchers.length } } },
  });

  cy.visit('/researcher/proposals');
  cy.get('[data-testid="new-proposal-button"]').click();
  cy.get('[data-testid="create-proposal-form"]').should('be.visible');
  cy.wait('@getFundingCalls');
  cy.wait('@getResearchers');
}

function fillCommonFields() {
  cy.get('[data-testid="funding-call-select"]').select('Climate Resilience Research');
  cy.get('[data-testid="title-input"]').type('Smart Grid Optimization Using Machine Learning');
  cy.get('[data-testid="abstract-input"]').type('A'.repeat(60));
  cy.get('[data-testid="amount-input"]').type('120000');
}

function interceptCreateProposal(selfId: string, coPIs: { id: string; name: string; email: string; department: string }[]) {
  interceptGql('CreateProposal', 'createProposal', {
    statusCode: 200,
    body: {
      data: {
        createProposal: {
          success: true,
          message: 'Proposal submitted successfully.',
          errors: null,
          proposal: fakeProposal(selfId, coPIs),
        },
      },
    },
  });
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('Researcher — Create Proposal with Co-PIs', () => {
  beforeEach(() => {
    loginAsResearcher();
  });

  it('creates a proposal with a single Co-PI', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));
      fillCommonFields();

      cy.get('[data-testid="copi-multiselect"]').click();
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Ama Boateng').click();
      cy.get('[data-testid="multi-select-chip"]').should('have.length', 1).and('contain.text', 'Dr. Ama Boateng');

      interceptCreateProposal(selfId, [{ id: 'res-aaa', name: 'Dr. Ama Boateng', email: 'ama@iser.edu', department: 'Public Finance' }]);
      cy.get('[data-testid="submit-proposal-button"]').click();

      cy.wait('@createProposal').its('request.body.variables.input.coPiIds').should('deep.equal', ['res-aaa']);
      cy.get('[data-testid="proposal-success-banner"]').should('be.visible');
    });
  });

  it('creates a proposal with multiple Co-PIs', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));
      fillCommonFields();

      cy.get('[data-testid="copi-multiselect"]').click();
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Ama Boateng').click();
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Kojo Mensah').click();
      cy.get('[data-testid="multi-select-chip"]').should('have.length', 2);

      interceptCreateProposal(selfId, [
        { id: 'res-aaa', name: 'Dr. Ama Boateng', email: 'ama@iser.edu', department: 'Public Finance' },
        { id: 'res-bbb', name: 'Dr. Kojo Mensah', email: 'kojo@iser.edu', department: 'Education' },
      ]);
      cy.get('[data-testid="submit-proposal-button"]').click();

      cy.wait('@createProposal').its('request.body.variables.input.coPiIds').should('deep.equal', ['res-aaa', 'res-bbb']);
      cy.get('[data-testid="proposal-success-banner"]').should('be.visible');
    });
  });

  it('creates a proposal with no Co-PIs', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));
      fillCommonFields();
      cy.get('[data-testid="multi-select-chip"]').should('not.exist');

      interceptCreateProposal(selfId, []);
      cy.get('[data-testid="submit-proposal-button"]').click();

      cy.wait('@createProposal').its('request.body.variables.input.coPiIds').should('deep.equal', []);
      cy.get('[data-testid="proposal-success-banner"]').should('be.visible');
    });
  });

  it('prevents selecting the same researcher twice', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));

      cy.get('[data-testid="copi-multiselect"]').click();
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Ama Boateng').click();
      cy.get('[data-testid="multi-select-chip"]').should('have.length', 1);

      // The dropdown stays open after a selection — the just-selected
      // researcher must already be gone from the remaining options.
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Ama Boateng').should('not.exist');
      cy.get('[data-testid="multi-select-chip"]').should('have.length', 1);
    });
  });

  it('excludes the current researcher from the Co-PI list', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));

      cy.get('[data-testid="copi-multiselect"]').click();
      cy.get('[data-testid="multi-select-option"]').should('contain.text', 'Dr. Ama Boateng');
      cy.get('[data-testid="multi-select-option"]').contains('SELF-SHOULD-NOT-APPEAR').should('not.exist');
    });
  });

  it('removes a selected Co-PI chip', () => {
    getCurrentUserId().then((selfId) => {
      openCreateForm(fakeResearchers(selfId));

      cy.get('[data-testid="copi-multiselect"]').click();
      cy.get('[data-testid="multi-select-option"]').contains('Dr. Ama Boateng').click();
      cy.get('[data-testid="multi-select-chip"]').should('have.length', 1);

      cy.get('[data-testid="multi-select-remove-chip"]').click();
      cy.get('[data-testid="multi-select-chip"]').should('not.exist');
    });
  });
});
