describe('Login Page', () => {
    const testEmail = 'admin@example.com';
    const testPassword = 'duc123';

    before(() => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/api/auth/exists`,
            failOnStatusCode: false,
            body: { email: testEmail }
        }).then((response) => {
            if (response.status === 404) {
                cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/register`, {
                    name: 'Admin User',
                    email: testEmail,
                    password: testPassword
                });
            } else {
                cy.log("User exists, skipping creation");
            }
        });
    });
    beforeEach(() => {
        cy.visit('http://localhost:5173');
    });

    it('should show validation for empty email', () => {
        cy.get('button[type="submit"]').contains('Sign In').click();
        cy.get('[data-testid="login-error"]').should('contain', 'Email is required');
    });
    it('should show validation for empty password', () => {
        cy.get('[data-testid="login-email"]').type('test@example.com');
        cy.get('button[type="submit"]').contains('Sign In').click();
        cy.get('[data-testid="login-error"]').should('contain', 'Password is required');
    });



    it('should login successfully with valid credentials', () => {
        cy.get('.sign-in-container').within(() => {
            cy.get('input[name="email"]').type('admin@example.com');
            cy.get('input[name="password"]').type('duc123');
            cy.get('button[type="submit"]').click();
        });

        cy.window().should((win) => {
            const user = JSON.parse(win.localStorage.getItem('user'));
            expect(user).to.have.property('id');
            expect(user).to.have.property('email', 'admin@example.com');
        });

        cy.url().should('include', '/users/');
    });

    it('should show error for incorrect password', () => {
        cy.get('[data-testid="login-email"]').type('testuser@example.com');
        cy.get('[data-testid="login-password"]').type('WrongPass');
        cy.get('button[type="submit"]').contains('Sign In').click();
        cy.get('[data-testid="login-error"]').should('contain', 'Invalid email or password');
    });

    it('should not set localStorage for failed login', () => {
        cy.get('[data-testid="login-email"]').type('testuser@example.com');
        cy.get('[data-testid="login-password"]').type('WrongPass');
        cy.get('button[type="submit"]').contains('Sign In').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem('user')).to.be.null;
        });
    });

    it('should switch to Sign Up panel', () => {
        cy.get('.overlay-panel.overlay-right').find('button').contains('Sign Up').click();
        cy.get('.sign-up-container form').should('be.visible');
    });

    it('should switch back to Sign In panel', () => {
        cy.get('.overlay-panel.overlay-right').find('button').contains('Sign Up').click();
        cy.get('.overlay-panel.overlay-left').find('button').contains('Sign In').click();
        cy.get('.sign-in-container form').should('be.visible');
    });




});
