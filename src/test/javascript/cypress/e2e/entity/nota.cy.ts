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

describe('Nota e2e test', () => {
  const notaPageUrl = '/nota';
  const notaPageUrlPattern = new RegExp('/nota(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notaSample = { valor: 833, area: 'HUMANAS' };

  let nota;
  let aluno;
  let simulado;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/alunos',
      body: { nome: 'indeed because who' },
    }).then(({ body }) => {
      aluno = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/simulados',
      body: { nome: 'till' },
    }).then(({ body }) => {
      simulado = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/notas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/notas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/notas/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/alunos', {
      statusCode: 200,
      body: [aluno],
    });

    cy.intercept('GET', '/api/simulados', {
      statusCode: 200,
      body: [simulado],
    });
  });

  afterEach(() => {
    if (nota) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/notas/${nota.id}`,
      }).then(() => {
        nota = undefined;
      });
    }
  });

  afterEach(() => {
    if (aluno) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/alunos/${aluno.id}`,
      }).then(() => {
        aluno = undefined;
      });
    }
    if (simulado) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/simulados/${simulado.id}`,
      }).then(() => {
        simulado = undefined;
      });
    }
  });

  it('Notas menu should load Notas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('nota');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Nota').should('exist');
    cy.url().should('match', notaPageUrlPattern);
  });

  describe('Nota page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Nota page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/nota/new$'));
        cy.getEntityCreateUpdateHeading('Nota');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/notas',
          body: {
            ...notaSample,
            aluno,
            simulado,
          },
        }).then(({ body }) => {
          nota = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/notas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/notas?page=0&size=20>; rel="last",<http://localhost/api/notas?page=0&size=20>; rel="first"',
              },
              body: [nota],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Nota page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('nota');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notaPageUrlPattern);
      });

      it('edit button click should load edit Nota page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Nota');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notaPageUrlPattern);
      });

      it('edit button click should load edit Nota page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Nota');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notaPageUrlPattern);
      });

      it('last delete button click should delete instance of Nota', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('nota').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notaPageUrlPattern);

        nota = undefined;
      });
    });
  });

  describe('new Nota page', () => {
    beforeEach(() => {
      cy.visit(`${notaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Nota');
    });

    it('should create an instance of Nota', () => {
      cy.get(`[data-cy="valor"]`).type('19');
      cy.get(`[data-cy="valor"]`).should('have.value', '19');

      cy.get(`[data-cy="area"]`).select('HUMANAS');

      cy.get(`[data-cy="aluno"]`).select(1);
      cy.get(`[data-cy="simulado"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        nota = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notaPageUrlPattern);
    });
  });
});
