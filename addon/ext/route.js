import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default Mixin.create({
  // TODO: we should not have to do this
  perfService: computed(function() {
    return getOwner(this).lookup('service:ember-perf');
  }),

  setupController() {
    this.get('perfService').routeActivated(this);
    this._super(...arguments);
  },

  renderTemplate() {
    this.get('perfService').routeWillRender(this);
    this._super(...arguments);
  }
});
