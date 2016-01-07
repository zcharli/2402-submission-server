import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('your-ranking/rank-trophy', 'Integration | Component | your ranking/rank trophy', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{your-ranking/rank-trophy}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#your-ranking/rank-trophy}}
      template block text
    {{/your-ranking/rank-trophy}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
