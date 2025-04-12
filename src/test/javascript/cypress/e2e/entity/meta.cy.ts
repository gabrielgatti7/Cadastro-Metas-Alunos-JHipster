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

describe('Meta e2e test', () => {
  const metaPageUrl = '/meta';
  const metaPageUrlPattern = new RegExp('/meta(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const metaSample = { valor: 393, area: 'HUMANAS' };

  let meta;
  let aluno;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/alunos',
      body: { nome: 'roger' },
    }).then(({ body }) => {
      aluno = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/metas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/metas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/metas/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/alunos', {
      statusCode: 200,
      body: [aluno],
    });
  });

  afterEach(() => {
    if (meta) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/metas/${meta.id}`,
      }).then(() => {
        meta = undefined;
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
  });

  it('Metas menu should load Metas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('meta');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Meta').should('exist');
    cy.url().should('match', metaPageUrlPattern);
  });

  describe('Meta page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(metaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Meta page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/meta/new$'));
        cy.getEntityCreateUpdateHeading('Meta');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/metas',
          body: {
            ...metaSample,
            aluno,
          },
        }).then(({ body }) => {
          meta = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/metas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [meta],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(metaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Meta page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('meta');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaPageUrlPattern);
      });

      it('edit button click should load edit Meta page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Meta');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaPageUrlPattern);
      });

      it('edit button click should load edit Meta page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Meta');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaPageUrlPattern);
      });

      it('last delete button click should delete instance of Meta', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('meta').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaPageUrlPattern);

        meta = undefined;
      });
    });
  });

  describe('new Meta page', () => {
    beforeEach(() => {
      cy.visit(`${metaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Meta');
    });

    it('should create an instance of Meta', () => {
      cy.get(`[data-cy="valor"]`).type('404');
      cy.get(`[data-cy="valor"]`).should('have.value', '404');

      cy.get(`[data-cy="area"]`).select('MATEMATICA');

      cy.get(`[data-cy="aluno"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        meta = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', metaPageUrlPattern);
    });
  });
});
