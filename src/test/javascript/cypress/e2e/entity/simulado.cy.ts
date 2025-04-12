import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Simulado e2e test', () => {
  const simuladoPageUrl = '/simulado';
  const simuladoPageUrlPattern = new RegExp('/simulado(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const simuladoSample = { nome: 'ha' };

  let simulado;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/simulados+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/simulados').as('postEntityRequest');
    cy.intercept('DELETE', '/api/simulados/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (simulado) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/simulados/${simulado.id}`,
      }).then(() => {
        simulado = undefined;
      });
    }
  });

  it('Simulados menu should load Simulados page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('simulado');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Simulado').should('exist');
    cy.url().should('match', simuladoPageUrlPattern);
  });

  describe('Simulado page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(simuladoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Simulado page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/simulado/new$'));
        cy.getEntityCreateUpdateHeading('Simulado');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', simuladoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/simulados',
          body: simuladoSample,
        }).then(({ body }) => {
          simulado = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/simulados+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/simulados?page=0&size=20>; rel="last",<http://localhost/api/simulados?page=0&size=20>; rel="first"',
              },
              body: [simulado],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(simuladoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Simulado page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('simulado');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', simuladoPageUrlPattern);
      });

      it('edit button click should load edit Simulado page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Simulado');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', simuladoPageUrlPattern);
      });

      it('edit button click should load edit Simulado page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Simulado');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', simuladoPageUrlPattern);
      });

      it('last delete button click should delete instance of Simulado', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('simulado').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', simuladoPageUrlPattern);

        simulado = undefined;
      });
    });
  });

  describe('new Simulado page', () => {
    beforeEach(() => {
      cy.visit(`${simuladoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Simulado');
    });

    it('should create an instance of Simulado', () => {
      cy.get(`[data-cy="nome"]`).type('psst');
      cy.get(`[data-cy="nome"]`).should('have.value', 'psst');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        simulado = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', simuladoPageUrlPattern);
    });
  });
});
