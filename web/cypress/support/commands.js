// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
/**
 * Login as role with configured account in cypress.json file
 *
 * @param  string role - accept: 'superadmin', 'admin', 'member'
 */
Cypress.Commands.add('loginAs', (role) => {
  let auth = {}
  switch (role) {
    case 'superadmin':
      auth = Cypress.env('roles').superadmin
      break
    case 'admin':
      auth = Cypress.env('roles').admin
      break
    case 'member':
      auth = Cypress.env('roles').member
      break
    default:
      break
  }

  cy.request('GET', '/').then((response) => {
    let str = response.headers['set-cookie'][0]
    let token = str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '') + '=='
    cy.request({
      method: 'POST',
      url: '/api/login',
      headers: {
        'X-XSRF-TOKEN': token
      },
      body: {
        email: auth.email,
        password: auth.password
      }
    })
  })
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload'