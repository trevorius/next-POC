describe('Organization Management', () => {
  beforeEach(() => {
    // Mock superadmin session
    cy.intercept('/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'admin@example.com',
          isSuperAdmin: true,
        },
      },
    });

    // Mock organizations list
    cy.intercept('GET', '/api/organizations', {
      statusCode: 200,
      body: [],
    }).as('getOrganizations');
  });

  it('allows superadmin to create and view organizations', () => {
    // Visit the organization management page
    cy.visit('/superadmin/organization');

    // Check page title
    cy.get('h1').should('contain', 'Organization Management');

    // Open create organization dialog
    cy.contains('button', 'Create Organization').click();

    // Fill in the form
    cy.get('input[name="name"]').type('Test Organization');
    cy.get('input[name="ownerName"]').type('John Doe');
    cy.get('input[name="ownerEmail"]').type('john@example.com');

    // Mock create organization API call
    cy.intercept('POST', '/api/organizations', {
      statusCode: 201,
      body: {
        id: '1',
        name: 'Test Organization',
        createdAt: new Date().toISOString(),
        members: [
          {
            id: '1',
            role: 'OWNER',
            user: {
              id: '2',
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
        ],
      },
    }).as('createOrganization');

    // Submit the form
    cy.contains('button', 'Create').click();

    // Wait for API call and verify
    cy.wait('@createOrganization');

    // Verify organization appears in the list
    cy.contains('Test Organization').should('be.visible');
    cy.contains('john@example.com').should('be.visible');
  });

  it('redirects non-superadmin users', () => {
    // Mock non-superadmin session
    cy.intercept('/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: '2',
          email: 'user@example.com',
          isSuperAdmin: false,
        },
      },
    });

    // Try to visit the organization management page
    cy.visit('/superadmin/organization');

    // Should be redirected to unauthorized page
    cy.url().should('include', '/unauthorized');
  });

  it('shows error message when organization creation fails', () => {
    cy.visit('/superadmin/organization');

    // Open create organization dialog
    cy.contains('button', 'Create Organization').click();

    // Fill in the form
    cy.get('input[name="name"]').type('Test Organization');
    cy.get('input[name="ownerName"]').type('John Doe');
    cy.get('input[name="ownerEmail"]').type('john@example.com');

    // Mock failed API call
    cy.intercept('POST', '/api/organizations', {
      statusCode: 500,
      body: { error: 'Failed to create organization' },
    }).as('createOrganizationError');

    // Submit the form
    cy.contains('button', 'Create').click();

    // Verify error handling
    cy.wait('@createOrganizationError');
    cy.contains('Failed to create organization').should('be.visible');
  });
});
