'use babel'

import consts from './config/consts.js';
import {selectorsMatchScopeChain, selectorForScopeChain, buildScopeChainString} from './util/scope-helpers.js';
import {
  getCache,
  isSubset,
  buildScopeChain,
  parseScopeChain,
  matcherForSelector,
  selectorMatchesAnyScope,
  anySelectorMatchAnyScope,
  selectorMatchesAllScopes,
  anySelectorMatchAllScopes
}
from './util/selectors.js';
//import { selectorMatchesAnyScope, matcherForSelector, selectorMatchesAllScopes }  from 'C:\\Users\\alonperezext\\Documents\\DESARROLLO\\Github\\apercova\\atom-selectors-plus';
//import { selectorMatchesAnyScope, matcherForSelector, selectorMatchesAllScopes }  from '../../atom-selectors-plus';
//import {selectorMatchesAnyScope, matcherForSelector} from './util/selectors0.js';
import slick from 'atom-slick'
import {Selector} from 'selector-kit';
import BaseFormatter from './formatters/base.formatter.js';
import DefaultFormatter from './formatters/default.formatter.js';
import BasePathProvider from './providers/base-path.provider.js'
import CurrentFilePathProvider from './providers/current-file-path.provider.js';
import CurrentFileRelativePathProvider from './providers/current-file-relative-path.provider.js';
import NodeJSPathProvider from './providers/nodejs-path.provider.js';
import NodeJSFormatter from './formatters/nodejs.formatter.js';

function printCache() {
  console.log('===== cachedMatchesBySelector =====');
  console.dir(getCache());
  console.log('===== cachedMatchesBySelector =====');
}

/*TODO: Add configurable logging with enable /disable config option. Console and file transport @winston*/
export default class AtomPathIntellisenseImpl {
  constructor(package) {
    this.selector = "*";
    this.suggestionPriority = 1;
    this.inclusionPriority = 2;
    this.excludeLowerPriority = false;
    this.filterSuggestions = true;
  }
  getSuggestions(req) {
    this._testSelectors(req);
    return [];
  }
  _testSelectors(req) {
    let selector = '.source.js .string.quoted';
    let scopeChain = '.source.js';
    console.log(`ScopeChain => ${scopeChain}`);
    console.log(`selector   => ${selector}`);

    let match = selectorMatchesAnyScope(selector, scopeChain); // true
    console.log(`selectorMatchesAnyScope(${selector}, ${scopeChain}) => ${match}`);
    match = selectorMatchesAllScopes(selector, scopeChain); // false
    console.log(`selectorMatchesAllScopes(${selector}, ${scopeChain}) => ${match}`);

    selector = '.source.js .string.quoted, .text.plain';
    scopeChain = '.source.js';
    console.log(`ScopeChain => ${scopeChain}`);
    console.log(`selector   => ${selector}`);

    match = anySelectorMatchAnyScope(selector, scopeChain); // true
    console.log(`anySelectorMatchAnyScope(${selector}, ${scopeChain}) => ${match}`);
    match = anySelectorMatchAllScopes(selector, scopeChain); // false
    console.log(`anySelectorMatchAllScopes(${selector}, ${scopeChain}) => ${match}`);
    printCache();
  }
  _testSelectors02(req) {
    const scopeChain = req.editor.getLastCursor().getScopeDescriptor().getScopeChain();
    console.log(`ScopeChain => ${scopeChain}`);
    const parsedScopes = parseScopeChain(scopeChain);
    console.log(`parseScopeChain => ${parsedScopes}`);
    const scopes = req.editor.getLastCursor().getScopeDescriptor().scopes;
    console.log(`scopes => [${scopes}]`);
    console.log(`============================================================`);
    console.log('Testing selectorMatchesAnyScope(selector, scopes) function \n');
    let selector = '*';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.js.source.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.text.plain .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.xml.source .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    selector = '.source.js .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopes)}`);
    console.log(`============================================================`);
    console.log('Testing selectorMatchesAllScopes(selector, scopes) function \n');
    selector = '*';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.js.source.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.text.plain .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.xml.source .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    selector = '.source.js .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopes)}`);
    console.log(`============================================================`);


    console.log(`============================================================`);
    console.log('Testing selectorMatchesAnyScope(selector, scopeChain) function \n');
    selector = '*';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.js.source.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.text.plain .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.xml.source .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    selector = '.source.js .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAnyScope(selector,scopeChain)}`);
    console.log(`============================================================`);
    console.log('Testing selectorMatchesAllScopes(selector, scopes) function \n');
    selector = '*';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js .quoted.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source .string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source .quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source .string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source.string';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.js.source.string.quoted';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.text.plain .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.xml.source .string.quoted.template';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    selector = '.source.js .number';
    console.log(`selector: [${selector}] => ${selectorMatchesAllScopes(selector,scopeChain)}`);
    console.log(`============================================================`);
    printCache();
  }
  _testSelectors03(req) {
    const scopeChain = req.editor.getLastCursor().getScopeDescriptor().getScopeChain();
    console.log(`ScopeChain => ${scopeChain}`);
    const scopes = req.editor.getLastCursor().getScopeDescriptor().scopes;
    console.log(`scopes => [${scopes}]`);
    console.log(`============================================================`);
    console.log('Testing anySelectorMatchAnyScope(selector, scopes) function \n');
    let selector = '*, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source.js, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.string.quoted, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source.js .string.quoted, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.xml.source .string.quoted.template, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source .number, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source.js .number, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    selector = '.source.js .number, .text.plain, .source.js .string';
    console.log(`selector: [${selector}] => ${anySelectorMatchAnyScope(selector,scopeChain)}`);
    console.log(`============================================================`);

    console.log(`============================================================`);
    console.log('Testing anySelectorMatchAllScopes(selector, scopes) function \n');
    selector = '*, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source.js, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.string.quoted, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source.js .string.quoted, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.xml.source .string.quoted.template, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source .number, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source.js .number, .text.plain';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    selector = '.source.js .number, .text.plain, .source.js .string';
    console.log(`selector: [${selector}] => ${anySelectorMatchAllScopes(selector,scopeChain)}`);
    console.log(`============================================================`);

    printCache();
  }
  getSuggestionsBak(req) {
    console.log("=========================================");
    //console.dir(selectorsMatchScopeChain);
    //console.dir(selectorForScopeChain);
    //console.dir(buildScopeChainString);
    console.log("=========================================");
    /*const selectors = ['.source.js'];
    console.log(`selectors: {${selectors.join(' ,')}}`);
    const scopeChain = buildScopeChainString(req.editor.getLastCursor().getScopeDescriptor().scopes);
    console.log(`scopeChain: {${scopeChain}}`);
    let match = selectorsMatchScopeChain(selectors, scopeChain)
    console.log(`selectorsMatchScopeChain: {${match}}`);
*/
    console.dir(Selector);
    console.log("=========================================");
    const scopes = req.editor.getLastCursor().getScopeDescriptor().scopes;
    console.log(scopes);
    const selectors = [];
    scopes.forEach(e => {
      selectors.push(new Selector(e));
    });
    console.dir(selectors);
    const scopeChain = buildScopeChainString(req.editor.getLastCursor().getScopeDescriptor().scopes);
    console.log(`scopeChain: {${scopeChain}}`);
    let match = selectorsMatchScopeChain(selectors, scopeChain)
    console.log(`selectorsMatchScopeChain: {${match}}`);
    console.log("=========================================");
    //console.dir(req.scopeDescriptor.getScopeChain());
    //console.dir(req.scopeDescriptor.toString());
    console.log("=========================================");
    let suggestions = [];
    var bms = atom.config.get(`${consts.PACKAGE_NAME}.${consts.CF_MANUAL_SUGGEST}`);
    if(bms === true){
      if(req.activatedManually === true){
        console.log('Manually activated');
        suggestions = this._resolveSuggestions(req);
      }
    }else{
      console.log('Automatically activated');
      suggestions = this._resolveSuggestions(req);
    }
    return suggestions;
  }

  activate() {
    this._registerFormatters();
    this._registerPathProviders();
  }
  deactivate() {
    this.pathProviders.forEach((p, i, arr) => {
      p.dispose();
      arr = arr.splice(i, 1);
      p = null;
    });
  }
  _resolveSuggestions(req) {
    const self = this;
    var promize = new Promise((resolve, reject) => {
      const pathProvider = self._resolveBestPathProvider(req);
      if (pathProvider instanceof BasePathProvider) {
        pathProvider.resolve(req)
        .then(suggestions => {
          console.dir(suggestions);
          resolve(suggestions);
        })
        .catch(err => {
          throw new Error(err);
        });
      } else {
        resolve([]);
      }
    });
    return promize;
  }
  _registerFormatters() {
    console.log(`Registering formatters`);
    // deprecated
    this.defaultFormatter = new DefaultFormatter();
    this.formatters = [];
    this.formatters.push(new DefaultFormatter());
    this.formatters.push(new NodeJSFormatter());
    console.log(`Registered formatters`);
  }
  _registerPathProviders() {
    const self = this;
    console.log(`Registering providers`);
    self.pathProviders = [];
    self.pathProviders.push(new CurrentFilePathProvider(self.defaultFormatter));
    self.pathProviders.push(new CurrentFileRelativePathProvider(self.defaultFormatter));
    const nodeJSPathProvider = new NodeJSPathProvider(this.formatters.find(f => f.id === 'NodeJSFormatter'));
    self.pathProviders.push(nodeJSPathProvider);
    nodeJSPathProvider.activate()
    .then(($self) => console.log(`NodeJSPathProvider activated`))
    .catch((err, $self) => {
      console.warn(err);
      self.pathProviders = self.pathProviders
      .filter(p => p.id !== $self.id);
      console.dir(self.pathProviders);
      console.warn('NodeJSPathProvider deactivated');
    })
    .finally(() => console.log('promise ended'));

    self.pathProviders.forEach(p => {
      console.log('CurrentFilePathProvider.id ====>>' + CurrentFilePathProvider.id);
      if (p.id === CurrentFilePathProvider.id || p.id === CurrentFileRelativePathProvider.id) {
        //const cfScopes = atom.config.get(`${consts.PACKAGE_NAME}.${consts.CF_ALLOWED_SCOPES}`);
        const cfScopes = undefined;
        atom.config.set(`${consts.PACKAGE_NAME}.${p.id}.activatedx015`, true, {scopeSelector: `${cfScopes || p.scopeSelector}`});
      } else {
        atom.config.set(`${consts.PACKAGE_NAME}.${p.id}.activatedx015`, true, {scopeSelector: `${p.scopeSelector}`})
      }

    });
    console.log(`Registered providers`);
    console.dir(self.pathProviders);
  }
  _resolveBestPathProvider(req){
    const providers = this.pathProviders
    .filter(p => p instanceof BasePathProvider)
    // TODO filter by declared scopes
    .filter(p => {
      console.dir(req.scopeDescriptor);
      const valueAtCursor = atom.config.get(`${consts.PACKAGE_NAME}.${p.id}.activatedx015`, {scope: req.scopeDescriptor});
      console.dir(valueAtCursor);
      return valueAtCursor === true ? true : false;
    })
    .sort((a, b) => a.priority - b.priority);

    let provider = null;
    providers.some(p => {
      if (p.canResolve(req)) {
        provider = p;
        return true;
      }
    });

    if (provider instanceof BasePathProvider) {
      console.info('Best provider found');
      console.dir(provider);
    } else {
      console.warn('No provider found');
    }
    return provider;
  }
}
