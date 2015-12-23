import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ranking-tabs/assignment-ranking', 'Integration | Component | ranking tabs/assignment ranking', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ranking-tabs/assignment-ranking}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#ranking-tabs/assignment-ranking}}
      template block text
    {{/ranking-tabs/assignment-ranking}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
