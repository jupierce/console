// eslint-disable-next-line no-unused-vars
import ngRedux from 'ng-redux';

import thunk from 'redux-thunk';
import k8sReducers from './module/k8s/k8s-reducers';
import { combineReducers } from 'redux';

import './components/react-wrapper';

// The main app module.
angular.module('bridge', [
  // angular deps
  'react',
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'ngRedux',
  // other deps
  'ui.bootstrap',
  'lodash',
  'jquery',
  'coreos',
  'ngTagsInput',
  // internal modules
  'templates',
  'dex',
  'k8s',
  'bridge.const',
  'bridge.filter',
  'bridge.service',
  'bridge.ui',
  'bridge.page',
  'bridge.react-wrapper',
  'core.pkg',
  'heapster',
])
.config(function($compileProvider, $routeProvider, $locationProvider, $httpProvider,
                 configSvcProvider, errorMessageSvcProvider, flagSvcProvider,
                 k8sConfigProvider, activeNamespaceSvcProvider, $ngReduxProvider) {
  'use strict';

  const reducers = combineReducers({
    k8s: k8sReducers,
  });

  $ngReduxProvider.createStoreWith(reducers, [thunk]);

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  flagSvcProvider.setGlobalId('SERVER_FLAGS');
  k8sConfigProvider.setKubernetesPath('/api/kubernetes/', window.SERVER_FLAGS.k8sAPIVersion);
  $httpProvider.interceptors.push('unauthorizedInterceptorSvc');
  $httpProvider.defaults.timeout = 5000;

  configSvcProvider.config({
    siteBasePath: '/',
    libPath: '/static/lib/coreos-web',
    jsonParse: true,
    detectHost: true,
    detectScheme: true,
  });

  errorMessageSvcProvider.registerFormatter('k8sApi', function(resp) {
    if (resp.data && resp.data.message) {
      return resp.data.message;
    }
    return 'An error occurred. Please try again.';
  });

  errorMessageSvcProvider.registerFormatter('dexApi', function(resp) {
    if (resp.data && resp.data.error_description) {
      return resp.data.error_description;
    }
    return 'An error occurred. Please try again.';
  });

  function r(route, config) {
    config.resolve = {};
    config.resolve.ensureLoggedIn = 'ensureLoggedInSvc';
    $routeProvider.when(route, config);
  }

  r('/', {
    controller: 'ClusterStatusCtrl',
    templateUrl: '/static/page/cluster/status.html',
    title: 'Cluster Status',
  });

  r('/namespaces', {
    controller: 'NamespacesCtrl',
    templateUrl: '/static/page/namespaces/namespaces.html',
    title: 'Namespaces',
    reloadOnSearch: false,
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('events');
  r('/all-namespaces/events', {
    controller: 'EventsCtrl',
    templateUrl: '/static/page/events/events.html',
    title: 'Events',
  });
  r('/ns/:ns/events', {
    controller: 'EventsCtrl',
    templateUrl: '/static/page/events/events.html',
    title: 'Events',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('services');
  r('/all-namespaces/services', {
    controller: 'ServicesCtrl',
    templateUrl: '/static/page/services/services.html',
    title: 'Services',
  });
  r('/ns/:ns/services', {
    controller: 'ServicesCtrl',
    templateUrl: '/static/page/services/services.html',
    title: 'Services',
  });
  r('/ns/:ns/services/new', {
    controller: 'NewServiceCtrl',
    templateUrl: '/static/page/services/new-service.html',
    title: 'Create New Service',
  });
  r('/ns/:ns/services/:name', {
    controller: 'ServiceCtrl',
    templateUrl: '/static/page/services/service.html',
    title: 'Service',
  });
  r('/ns/:ns/services/:name/pods', {
    controller: 'ServicePodsCtrl',
    templateUrl: '/static/page/services/pods.html',
    title: 'Service Pods',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('replicationcontrollers');
  r('/all-namespaces/replicationcontrollers', {
    controller: 'ReplicationcontrollersCtrl',
    templateUrl: '/static/page/replicationcontrollers/replicationcontrollers.html',
    title: 'Replication Controllers',
  });
  r('/ns/:ns/replicationcontrollers', {
    controller: 'ReplicationcontrollersCtrl',
    templateUrl: '/static/page/replicationcontrollers/replicationcontrollers.html',
    title: 'Replication Controllers',
  });
  r('/ns/:ns/replicationcontrollers/new', {
    controller: 'NewReplicationcontrollerCtrl',
    templateUrl: '/static/page/replicationcontrollers/new-replicationcontroller.html',
    title: 'New Replication Controller',
  });
  r('/ns/:ns/replicationcontrollers/:name/edit', {
    controller: 'EditReplicationcontrollerCtrl',
    templateUrl: '/static/page/replicationcontrollers/edit-replicationcontroller.html',
    title: 'Edit Replication Controller',
  });
  r('/ns/:ns/replicationcontrollers/:name/events', {
    controller: 'ReplicationcontrollerSyseventsCtrl',
    templateUrl: '/static/page/replicationcontrollers/replicationcontroller-sysevents.html',
    title: 'Replication Controller Events',
  });
  r('/ns/:ns/replicationcontrollers/:name', {
    controller: 'ReplicationcontrollerCtrl',
    templateUrl: '/static/page/replicationcontrollers/replicationcontroller.html',
    title: 'Replication Controller',
  });
  r('/ns/:ns/replicationcontrollers/:name/pods', {
    controller: 'ReplicationcontrollerPodsCtrl',
    templateUrl: '/static/page/replicationcontrollers/pods.html',
    title: 'Replication Controller Pods',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('daemonsets');
  r('/all-namespaces/daemonsets', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Daemon Sets',
  });
  r('/ns/:ns/daemonsets', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/daemonsets/daemonsets.html',
    title: 'Daemon Sets',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('replicasets');
  r('/all-namespaces/replicasets', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Replica Sets',
  });
  r('/ns/:ns/replicasets', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Replica Sets',
  });
  r('/ns/:ns/replicasets/new', {
    controller: 'NewReplicaSetCtrl',
    templateUrl: '/static/page/replicasets/new-replicaset.html',
    title: 'New Replica Set',
  });
  r('/ns/:ns/replicasets/:name/edit', {
    controller: 'EditReplicaSetCtrl',
    templateUrl: '/static/page/replicasets/edit-replicaset.html',
    title: 'Edit Replica Set',
  });
  r('/ns/:ns/replicasets/:name', {
    controller: 'ReplicaSetCtrl',
    templateUrl: '/static/page/replicasets/replicaset.html',
    title: 'Replica Set',
  });
  r('/ns/:ns/replicasets/:name/pods', {
    controller: 'ReplicaSetPodsCtrl',
    templateUrl: '/static/page/replicasets/pods.html',
    title: 'Replica Set Pods',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('deployments');
  r('/all-namespaces/deployments', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Deployments',
  });
  r('/ns/:ns/deployments', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Deployments',
  });
  r('/ns/:ns/deployments/new', {
    controller: 'NewDeploymentCtrl',
    templateUrl: '/static/page/deployments/new-deployment.html',
    title: 'New Deployment',
  });
  r('/ns/:ns/deployments/:name/edit', {
    controller: 'EditDeploymentCtrl',
    templateUrl: '/static/page/deployments/edit-deployment.html',
    title: 'Edit Deployment',
  });
  r('/ns/:ns/deployments/:name', {
    controller: 'DeploymentCtrl',
    templateUrl: '/static/page/deployments/deployment.html',
    title: 'Deployment',
  });
  r('/ns/:ns/deployments/:name/pods', {
    controller: 'DeploymentPodsCtrl',
    templateUrl: '/static/page/deployments/pods.html',
    title: 'Deployment Pods',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('pods');
  r('/all-namespaces/pods', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Pods',
  });
  r('/ns/:ns/pods', {
    controller: 'k8sListCtrl',
    templateUrl: '/static/page/k8s-list/k8s-list.html',
    title: 'Pods',
  });
  r('/ns/:ns/pods/new', {
    controller: 'NewPodCtrl',
    templateUrl: '/static/page/pods/new-pod.html',
    title: 'Create New Pod',
  });
  r('/ns/:ns/pods/:name', {
    controller: 'PodCtrl',
    templateUrl: '/static/page/pods/pod.html',
    title: 'Pod',
  });
  r('/ns/:ns/pods/:name/events', {
    controller: 'PodSyseventsCtrl',
    templateUrl: '/static/page/pods/sysevents.html',
    title: 'Pod Events',
  });
  r('/ns/:ns/pods/:name/logs', {
    controller: 'PodLogsCtrl',
    templateUrl: '/static/page/pods/logs.html',
    title: 'Pod Logs',
  });
  r('/ns/:ns/pods/:name/logs/:containerName', {
    controller: 'PodLogsCtrl',
    templateUrl: '/static/page/pods/logs.html',
    title: 'Pod Logs',
  });
  r('/ns/:ns/pods/:podName/containers/:name', {
    controller: 'ContainerCtrl',
    templateUrl: '/static/page/containers/container.html',
    title: 'Container',
  });
  r('/nodes', {
    controller: 'NodesCtrl',
    templateUrl: '/static/page/nodes/nodes.html',
    title: 'Nodes',
  });
  r('/nodes/:name', {
    controller: 'nodeCtrl',
    templateUrl: '/static/page/nodes/node.html',
    title: 'Node',
  });
  r('/nodes/:name/events', {
    controller: 'nodeSyseventsCtrl',
    templateUrl: '/static/page/nodes/sysevents.html',
    title: 'Node Events',
  });
  r('/nodes/:name/tpm-event-log', {
    controller: 'nodeTpmLogCtrl',
    templateUrl: '/static/page/nodes/tpm-event-log.html',
    title: 'Node',
  });
  r('/nodes/:name/pods', {
    controller: 'nodePodsCtrl',
    templateUrl: '/static/page/nodes/pods.html',
    title: 'Node Pods',
  });

  activeNamespaceSvcProvider.registerNamespaceFriendlyPrefix('search');
  r('/all-namespaces/search', {
    controller: 'SearchCtrl',
    templateUrl: '/static/page/search/search.html',
    title: 'Search',
  });

  r('/ns/:ns/search', {
    controller: 'SearchCtrl',
    templateUrl: '/static/page/search/search.html',
    title: 'Search',
  });
  r('/settings/registries', {
    controller: 'RegistriesCtrl',
    templateUrl: '/static/page/settings/registries.html',
    title: 'Configure Registries',
  });
  r('/settings/profile', {
    controller: 'ProfileCtrl',
    templateUrl: '/static/page/settings/profile.html',
    title: 'Profile',
  });
  r('/settings/users', {
    controller: 'UsersCtrl',
    templateUrl: '/static/page/settings/users.html',
    title: 'Manage Users',
  });

  r('/audit-report', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/dtc/audit-report.html',
    title: 'Policy',
  });
  r('/create-policy', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/tpm/create.html',
    title: 'Create Policy',
  });
  r('/trusted-compute-policies', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/dtc/policy-list.html',
    title: 'Trusted Compute Policies',
  });

  r('/trusted-platform-modules', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/dtc/tpm-list.html',
    title: 'Trusted Platform Module',
  });

  r('/trusted-platform-modules/:name', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/dtc/tpm-page.html',
    title: 'Trusted Platform Module',
  });

  r('/trusted-compute-policies/:name', {
    controller: 'DTCCtrl',
    templateUrl: '/static/page/dtc/policy-page.html',
    title: 'Policy',
  });

  r('/welcome', {
    controller: 'WelcomeCtrl',
    templateUrl: '/static/page/welcome/welcome.html',
    title: 'Welcome to your CoreOS Cluster',
  });
  $routeProvider.when('/error', {
    controller: 'ErrorCtrl',
    templateUrl: '/static/page/error/error.html',
    title: 'Error',
  });

  $routeProvider.otherwise({
    templateUrl: '/static/page/error/404.html',
    title: 'Page Not Found (404)'
  });
})
.run(function(_, $rootScope, $location, $window, CONST, flagSvc, debugSvc, authSvc, k8s, featuresSvc, dex, angularBridge) {
  'use strict';
  // Convenience access for temmplates
  $rootScope.CONST = CONST;
  $rootScope.SERVER_FLAGS = flagSvc.all();
  $rootScope.debug = debugSvc;
  $rootScope.FEATURE_FLAGS = featuresSvc;
  angularBridge.expose();
  k8s.featureDetection();
  dex.featureDetection();

  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
    switch(rejection) {
      case 'not-logged-in':
        $window.location.href = '/auth/login';
        break;
    }
  });

  // Completely destroys Angular and reload page if in angular redirect loop.
  // NOTE: this is a big stupid hack to get around an Angular bug wich is triggered by a Chrome bug.
  // see: https://github.com/coreos-inc/bridge/issues/270
  $rootScope.$on('$locationChangeStart', function(e, currURL) {
    if (currURL === $window.location.origin + '/#') {
      e.preventDefault();
      $rootScope.$destroy();
      $rootScope.$$watchers = [];
      $rootScope.$$postDigestQueue = [];
      $rootScope.$$asyncQueue = [];
      $rootScope.$$listeners = null;
      $window.location.href = '/';
    }
  });

  $rootScope.$on('xhr-error-unauthorized', function(e, rejection) {
    if (rejection.config && rejection.config.unauthorizedOk) {
      return;
    }

    authSvc.logout($window.location.pathname);
  });
});
