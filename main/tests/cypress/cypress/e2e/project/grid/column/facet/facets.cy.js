/**
 * Those tests are generic test to ensure the general behavior of the various facets components
 * It's using "text facet" as it is the most simple facet
 */

/*
   IMPORTANT: Any test reliant on Facet Actions (Edit,Include/Exclude) should wait >100 msec to ensure the event
   handlers are setup, otherwise clicking on the action will do nothing.
   Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
 */
const clickFacetAction = (facetType, text, action) => {
  cy.getFacetContainer(facetType)
    .contains(text)
    .parent()
    .invoke('trigger', 'mouseenter'); // include/exclude not visible until we mouse over
  // start a new chain after the trigger
  cy.getFacetContainer(facetType)
    .contains(text)
    .siblings()
    .get(".facet-choice-toggle")
    .contains(action)
    .should('have.css', 'visibility', 'visible') // partially occluded, so "be.visible" won't work
    .click();
};

describe(__filename, function () {
  it('Verify facets panel (left-panel) appears with no facets yet', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets')
      .should('exist')
      .contains('Using facets and filters');
  });

  it('Test the display of multiple facets', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);
    cy.columnActionClick('Water', ['Facet', 'Text facet']);

    cy.getFacetContainer('NDB_No').should('exist');
    cy.getFacetContainer('Shrt_Desc').should('exist');
    cy.getFacetContainer('Water').should('exist');
  });

  it('Test the Remove all button', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets .facets-container .facet-container').should(
      'have.length',
      2
    );

    cy.get('a.button.button-pill-right').contains('Remove all').click();
    cy.get('#refine-tabs-facets .facets-container .facet-container').should(
      'have.length',
      0
    );
    cy.get('#refine-tabs-facets')
      .should('exist')
      .contains('Using facets and filters');
  });

  it('Test the Reset all button', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);
    cy.columnActionClick('Energ_Kcal', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets .facets-container .facet-container').should(
      'have.length',
      2
    );

    // Click to facet 1, select first value
    cy.getFacetContainer('Water')
      .find('.facet-choice:first-child .facet-choice-label')
      .click();
    cy.getFacetContainer('Water')
      .find('.facet-choice:first-child')
      .should('have.class', 'facet-choice-selected');

    // Click to facet 2, select first value
    cy.getFacetContainer('Energ_Kcal')
      .find('.facet-choice:first-child .facet-choice-label')
      .click();
    cy.getFacetContainer('Energ_Kcal')
      .find('.facet-choice:first-child')
      .should('have.class', 'facet-choice-selected');

    cy.get('a.button.button-pill-left').contains('Reset all').click();

    // all facets selections should be gone
    cy.getFacetContainer('Water')
      .find('.facet-choice:first-child')
      .should('not.have.class', 'facet-choice-selected');
    cy.getFacetContainer('Energ_Kcal')
      .find('.facet-choice:first-child')
      .should('not.have.class', 'facet-choice-selected');
  });

  it('Create a simple text facet, check various elements in a Facet', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets').should('exist');

    cy.getFacetContainer('Water').should('exist');
    cy.getFacetContainer('Water').contains('182 choices');
    cy.getFacetContainer('Water').contains('Sort by');
    cy.getFacetContainer('Water').contains('Cluster');
  });

  it('Delete a facet', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);

    cy.getFacetContainer('Water').find('a.facet-title-remove').click();
    cy.get('#refine-tabs-facets > div.browsing-panel-help').should('be.visible');
  });

  it('Test editing a facet ("change")', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.getFacetContainer('NDB_No')
      .find('a[bind="changeButton"]')
      .contains('change');
    cy.getFacetContainer('NDB_No').find('a[bind="changeButton"]').click();
    cy.get('.dialog-container .dialog-header').contains(
      `Edit facet's Expression`
    );
  });

  it('Test editing a facet / Preview', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);

    // test the tab
    cy.getFacetContainer('NDB_No').find('a[bind="changeButton"]').click();
    cy.get('.dialog-container #expression-preview-tabs-preview').should(
      'be.visible'
    );
    // test the content
    cy.get('.dialog-container #expression-preview-tabs-preview').contains(
      'row'
    );
  });

  it('Test editing a facet / History', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.getFacetContainer('NDB_No').find('a[bind="changeButton"]').click();

    // test the tab
    cy.get('.dialog-container a[bind="or_dialog_history"]').click();
    cy.get('.dialog-container #expression-preview-tabs-history').should(
      'be.visible'
    );
    // test the content
    cy.get('.dialog-container #expression-preview-tabs-history').contains(
      'Expression'
    );
  });

  it('Test editing a facet / Starred', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.getFacetContainer('NDB_No').find('a[bind="changeButton"]').click();

    // test the tab
    cy.get('.dialog-container a[bind="or_dialog_starred"]').click();
    cy.get('.dialog-container #expression-preview-tabs-starred').should(
      'be.visible'
    );
    // test the content
    cy.get('.dialog-container #expression-preview-tabs-starred').contains(
      'Expression'
    );
  });

  it('Test editing a facet / Help', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    cy.getFacetContainer('NDB_No').find('a[bind="changeButton"]').click();

    // test the tab
    cy.get('.dialog-container a[bind="or_dialog_help"]').click();
    cy.get('.dialog-container #expression-preview-tabs-help').should(
      'be.visible'
    );
    // test the content
    cy.get('.dialog-container #expression-preview-tabs-help').contains(
      'Variables'
    );
  });

  it('Create a facet, Sorts, by count', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets').should('exist');

    // Ensure sort should be by name by default
    cy.getFacetContainer('Water').contains('0.24');
    cy.getFacetContainer('Water').find('a[bind="sortByCountLink"]').click();
    // Sort should now be by count
    cy.getFacetContainer('Water').contains('15.87');
  });

  it('Create a facet, Sorts multiple', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);
    cy.get('#refine-tabs-facets').should('exist');

    // Sort should be by name by default
    cy.getFacetContainer('Water').contains('0.24');
    cy.getFacetContainer('Water').find('a[bind="sortByCountLink"]').click();
    // Sort should now be by count
    cy.getFacetContainer('Water').contains('15.87');
    cy.getFacetContainer('Water').find('a[bind="sortByNameLink"]').click();
    cy.getFacetContainer('Water').contains('0.24');
  });

  it('Test include/exclude filters', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    clickFacetAction('Shrt_Desc','ALLSPICE,GROUND', 'include');
    cy.getCell(0, 'Shrt_Desc').should('contain', 'ALLSPICE,GROUND');
    cy.get('#tool-panel').contains('1 matching rows');

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    clickFacetAction('Shrt_Desc','ANISE SEED', 'include');
    cy.getCell(1, 'Shrt_Desc').should('contain', 'ANISE SEED');
    cy.get('#tool-panel').contains('2 matching rows');

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    clickFacetAction('Shrt_Desc','BUTTER OIL,ANHYDROUS', 'include');
    cy.getCell(0, 'Shrt_Desc').should('contain', 'BUTTER OIL,ANHYDROUS');
    cy.get('#tool-panel').contains('3 matching rows');

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    clickFacetAction('Shrt_Desc','ALLSPICE,GROUND', 'exclude');
    cy.get('#tool-panel').contains('2 matching rows');
  });

  it('Test include/exclude, invert', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    // do a basic facetting, expect 1 row
    clickFacetAction('Shrt_Desc','ALLSPICE,GROUND','include');
    cy.getCell(0, 'Shrt_Desc').should('to.contain', 'ALLSPICE,GROUND');
    cy.get('#tool-panel').contains('1 matching rows');

    // now invert, expect 198 rows
    cy.intercept('POST', '**/command/core/get-rows*').as('getRows');
    cy.getFacetContainer('Shrt_Desc').find('a[bind="invertButton"]').click();
    cy.wait('@getRows');
    cy.get('body[ajax_in_progress="false"]');
    cy.get('#tool-panel').contains('198 matching rows');
    cy.getFacetContainer('Shrt_Desc')
      .find('a[bind="invertButton"]')
      .should('have.class', 'facet-mode-inverted');

    // remove invert
    cy.getFacetContainer('Shrt_Desc').find('a[bind="invertButton"]').click();
    cy.get('#tool-panel').contains('1 matching rows');
  });

  it('Test facet reset', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);
    // do a basic facetting, expect 1 row
    clickFacetAction('Shrt_Desc','ALLSPICE,GROUND','include',true);
    cy.get('#tool-panel').contains('1 matching rows');

    // now reset, expect 199
    cy.getFacetContainer('Shrt_Desc')
      .find('a[bind="resetButton"]')
      .contains('reset')
      .click();
    cy.get('#tool-panel').contains('199 rows');
    cy.getFacetContainer('Shrt_Desc')
      .find('a[bind="resetButton"]')
      .should('not.be.visible');
  });

  /**
   * This test ensure the refresh button behavior when editing a facet
   * The grid is updated with a duplicate on "BUTTER,WITH SALT"
   * Then we ensure the number of occurences is respected
   */
  it('Test refresh reset', function () {
    cy.loadAndVisitProject('food.mini');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);

    cy.get('.facet-choice').should('have.length', 2);
    cy.get('.facet-choice:nth-child(1)').contains('BUTTER,WHIPPED,WITH SALT');
    cy.get('.facet-choice:nth-child(2)').contains('BUTTER,WITH SALT');

    cy.editCell(1, 'Shrt_Desc', 'BUTTER,WITH SALT');
    cy.get('#refine-tabs-facets .browsing-panel-controls-refresh')
      .contains('Refresh')
      .click();
    cy.get('.facet-choice').should('have.length', 1);
    cy.get('.facet-choice:first-child').contains('BUTTER,WITH SALT');
    cy.getFacetContainer('Shrt_Desc').find('.facet-choice-count').contains(2);
  });

  it('Test facet by choice count', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);
    cy.getFacetContainer('Shrt_Desc')
      .find('.facet-body-controls')
      .contains('Facet by choice counts')
      .click();
    // TODO: This can be flaky, but not sure why. Not reproducible in isolated testing.
    cy.get(`#refine-tabs-facets .facets-container .facet-container#facet-1`)
      .should('exist')
      .contains('Shrt_Desc');
  });

  it('Test the mass edit from a Facet', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('Water', ['Facet', 'Text facet']);

    // Wait to ensure action click handler is setup
    // Ref:  window.setTimeout(wireEvents, 100); in list-facet.js
    cy.wait(150);

    cy.get('div.facet-body-inner > div:nth-child(8)')
        .contains('15.87')
        .parent()
        .within(() => {
          const elem = cy.contains('edit');
          elem.invoke('css', 'visibility', 'visible');
          elem.click();
        })
        .root().then(() => {
          // Mass edit all cells that have Water = 15.87
          cy.get('.data-table-cell-editor textarea').should('exist').type(50);
          cy.get('.data-table-cell-editor button').contains('Apply').click();

          // Ensure rows have been modified
          cy.getCell(0, 'Water').should('to.contain', 50);
          cy.getCell(1, 'Water').should('to.contain', 50);

          // Ensure modification is made only to the rows that had 15.87, not the others
          cy.getCell(2, 'Water').should('to.contain', 0.24);
      });
  });

  it('Test opening the clustering from a facet', function () {
    cy.loadAndVisitProject('food.mini');
    cy.columnActionClick('Shrt_Desc', ['Facet', 'Text facet']);
    cy.getFacetContainer('Shrt_Desc')
        .find('button')
        .contains('Cluster')
        .click();

    cy.get('.dialog-container .dialog-header').should(
        'to.contain',
        'Cluster and edit column "Shrt_Desc"'
    );
  });

  it('Test collapsing facet panels', function () {
    cy.loadAndVisitProject('food.small');
    cy.columnActionClick('NDB_No', ['Facet', 'Text facet']);
    // ensure facet inner panel is visible
    cy.get('#refine-tabs-facets .facets-container li:nth-child(1) .facet-body-inner').should('be.visible');
    // collapse the panel
    cy.get('#refine-tabs-facets .facets-container li:nth-child(1) a[bind="minimizeButton"]').click();
    // Make sure the body is hidden
    cy.get('#refine-tabs-facets .facets-container li:nth-child(1) .facet-body').should('not.be.visible');
  });

});
