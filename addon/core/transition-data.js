import { create as emberCreate } from '@ember/polyfills';
import { assert } from '@ember/debug';
import performanceNow from '../utils/performance-now';
import RenderData from './render-data';

// allow compatibility with IE8 via Ember's create polyfill
// eslint-disable-next-line
const create = Object.create || emberCreate;

function TransitionData(args) {
  this._super$constructor(...arguments);

  this.destURL = args.destURL;
  this.destRoute = args.destRoute;
  this.routes = [];
}

function t() {
  return performanceNow();
}

let prototype = (TransitionData.prototype = create(RenderData.prototype));
prototype.constructor = TransitionData;
prototype._super$constructor = RenderData;

prototype.activateRoute = function activateRoute(route) {
  let startTime = t();
  let r = {
    name: route.routeName,
    debugContainerKey: route._debugContainerKey,
    startTime,
    views: []
  };
  this.routes.push(r);
  if (route.routeName.indexOf('loading') < 0 || !this._lastActivatedRoute) {
    this._lastActivatedRoute = r;
  }
};

prototype.routeFinishedSetup = function routeFinishedSetup(route) {
  let endTime = t();
  let [r] = this.routes.filter(r => r.name === route.routeName);
  let assertMessage =
    'setupController did not fire for this route. Please make sure to call `this._super(...arguments) in setupController so `ember-perf` can initialize.';
  assert(assertMessage, r);
  r.endTime = endTime;
  r.elapsedTime = r.endTime - r.startTime;
};

prototype._viewAdded = function _viewAdded(view, index) {
  this._lastActivatedRoute.views.push(index);
};

export default TransitionData;
