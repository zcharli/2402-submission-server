import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ranking-tabs', 'Integration | Component | ranking tabs', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ranking-tabs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#ranking-tabs}}
      template block text
    {{/ranking-tabs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
