/**
 * Base formatter class
 * @author {@literal @}apercova
 * <a href="https://github.com/apercova" target="_blank">https://github.com/apercova</a>
 * <a href="https://twitter.com/apercova" target="_blank">{@literal @}apercova</a>
 * @since 0.2.0
 */
module.exports = {
  getCache,
  isSubset,
  buildScopeChain,
  parseScopeChain,
  matcherForSelector,
  selectorMatchesAnyScope,
  anySelectorMatchAnyScope,
  selectorMatchesAllScopes,
  anySelectorMatchAllScopes
};

const matchAllCacheNS = 'mAll';
const matchAnyCacheNS = 'mAny';
const cachedMatchesBySelector = {};


/**
 * getCache - returns cache object.
 *
 * @return {object}  Cache object.
 */
function getCache() { return cachedMatchesBySelector; }

/**
 * getCachedMatch - Returns cache match for selector against scope chain.
 *
 * @param  {string} selector   Scope selector.
 * @param  {string} scopeChain Scope chain.
 * @param  {string} ns         Optional namespace. Defaults to 'root'.
 * @return {boolean}           Cache match for selector against scope chain.
 */
function getCachedMatch(selector, scopeChain, ns){
  const cachedMatchesByScopeChain = (cachedMatchesBySelector[(ns || 'root')] || {})[selector];
  return cachedMatchesByScopeChain ? cachedMatchesByScopeChain[scopeChain] : undefined;
}

/**
 * setCachedMatch - Adds a selector match to cache.
 *
 * @param  {string} selector   Scope selector.
 * @param  {string} scopeChain Scope chain.
 * @param  {string} match      Match to add. {@code true} or {@code false}.
 * @param  {string} ns         namespace. Defaults to 'root'.
 */
function setCachedMatch (selector, scopeChain, match, ns) {
  ns = ns || 'root';
  let cachedMatchesByNS = cachedMatchesBySelector[ns];
  if (!cachedMatchesByNS) {
    cachedMatchesByNS = {};
    cachedMatchesBySelector[ns] = cachedMatchesByNS;
  }
  let cachedMatchesByScopeChain = cachedMatchesByNS[selector];
  if (!cachedMatchesByScopeChain) {
    cachedMatchesByScopeChain = {};
    cachedMatchesByNS[selector] = cachedMatchesByScopeChain;
  }
  cachedMatchesByScopeChain[scopeChain] = match;
  return cachedMatchesByScopeChain[scopeChain];
}

/**
 * always - Generator function for scope validation. Always return true.
 *
 * @param  {any}      scope Scope
 * @return {function}       Function for scope validation.
 */
function always(scope) { return true; }

/**
 * parse - Breaks down a selector in to atomic selectors.
 * Eg. '.source.js' => [source,js]
 *
 * @param  {string} selector Scope selector.
 * @return {Array}          Array of tokens.
 */
function parse(selector) {
  return typeof selector === 'string'
    ? selector.replace(/^\./, '').replace(/^\s/, '').split('.')
    : selector;
}

/**
 * isSubset - Determines whether an array is a subset of another array.
 *
 * @param  {Array} subset   Possible subset
 * @param  {Array} superset Possible superset
 * @return {boolean}        {@code true} if {@code subset} is a subset of {@code superset}. {@code false} otherwise.
 */
function isSubset(subset, superset) {
  return (Array.isArray(subset) && Array.isArray(superset)) &&
          subset
          .filter(sub => superset.includes(sub))
          .length === subset.length;
}

/**
 * buildScopeChain - Build a scope chain from a scope array.
 * Eg. [source.js,string.quoted] => '.source.js .string.quoted'
 *
 * @param  {Array} scopes Scope Array
 * @return {string}       Scope chain
 */

function buildScopeChain(scopes) {
  return `.${scopes.join(' .')}`;
}

/**
 * parseScopeChain - Parses a scope chain and generates a scopeArray.
 * Eg. '.source.js .string.quoted' => [source.js,string.quoted]
 *
 * @param  {string} scopeChain Scope chain
 * @return {Array}             Scope array
 */

function parseScopeChain(scopeChain) {
  return typeof scopeChain === 'string'
    ? scopeChain.trim().split(/[\t\s]+/).map(s => s.replace(/^\./, '')) : '';
}


/**
 * matcherForSelector - Generator function.
 * Return a matcher function for a selector.
 * {(scope: String) -> Boolean}, a matcher function returning true if
 * the scope matches the selector.
 *
 * @param  {string | function} selector Scope Selector
 * @return {type}          Matcher for selector
 */
function matcherForSelector(selector) {
  const parts = parse(selector);
  if (typeof parts === 'function') return parts;
  return selector ? scope => isSubset(parts, parse(scope)) : always;
}

/**
 * selectorMatchesAnyScope -  Return {@code true} if the selector matches any
 * provided scope.
 * The main difference with {@link selectorMatchesAllScopes} is that this
 * function does not ensure that scope selector matches for every single scope.
 * Eg:
 *    selectorMatchesAllScopes(
 *        '.source.js .string.quoted',
 *        '.source.js'
 *     ) => true
 *
 * @param  {string}         selector Scope selector.
 * @param  {Array | string} scopes   Scope array or scope chain.
 * @param  {boolean}        useCache Optional. indicates whether or not to use cache. Defaults to true.
 * @return {boolean}                 {@code true} if the selector matches any provided scope. {@code false} otherwise.
 */
function selectorMatchesAnyScope(selector, scopes, useCache) {
  if (!selector) return false;
  if (selector === '*') return true;
  scopes = typeof scopes === 'string'
  ? parseScopeChain(scopes) : ( Array.isArray(scopes) ? scopes : []);

  if (useCache === false) {
    const selectorTokens = selector.trim().split(/[\t\s]+/);
    return selectorTokens.some(_selector => scopes.some(matcherForSelector(_selector)));
  } else {
    let scopeChain = typeof scopes === 'string'
    ? scopes : ( Array.isArray(scopes) ? buildScopeChain(scopes) : '');

    const cachedMatch = getCachedMatch(selector, scopeChain, matchAnyCacheNS);
    if (cachedMatch != null) {
      console.warn(`selectorMatchesAnyScope :: Match for selector [${selector}] found in cache: [${cachedMatch}]`);
      return cachedMatch;
    } else {
      const selectorTokens = selector.trim().split(/[\t\s]+/);
      const match = selectorTokens.some(_selector => scopes.some(matcherForSelector(_selector)));
      setCachedMatch(selector, scopeChain, match, matchAnyCacheNS);
      //console.warn(`selectorMatchesAnyScope :: Match for selector [${selector}] added to cache: [${match}]`);
      return match;
    }
  }
}


/**
 * anySelectorMatchAnyScope - Return {@code true} if any provided selector
 * matches any provided scope.
 * Relies on {@link selectorMatchesAnyScope} for selector matching but accepts
 * multiple comma separated selectors
 * Eg:
 *     anySelectorMatchAnyScope(
 *         '.source.js .string.quoted, .text.plain',
 *         '.source.js'
 *     ) => true
 *
 * @param  {string}         selectors Scope selectors. Comma-separated (,).
 * @param  {Array | string} scopes    Scope array or scope chain.
 * @param  {boolean}        useCache  Optional. indicates whether or not to use cache. Defaults to true.
 * @return {boolean}                  {@code true} if any selector matches any provided scope. {@code false} otherwise.
 */
function anySelectorMatchAnyScope(selectors, scopes, useCache) {
  selectors = typeof selectors === 'string'
  ? selectors.split(',').map(s => s.trim())
  : (Array.isArray(selectors) ? selectors : []);
  return selectors.some( _selector => selectorMatchesAnyScope(_selector, scopes, useCache));
}

/**
 * selectorMatchesAllScopes - Return {@code true} if the selector matches all
 * provided scopes.
 * The main difference with {@link selectorMatchesAnyScope} is that this
 * function does ensure that scope selector matches for every scope token.
 * Eg:
 *     selectorMatchesAllScopes(
 *         '.source.js .string.quoted',
 *         '.source.js'
 *     ) => false
 *
 * @param  {string}         selector description
 * @param  {Array | string} scopes   Scope array or scope chain.
 * @param  {boolean}        useCache Optional. indicates whether or not to use cache. Defaults to true.
 * @return {boolean}                 {@code true} if the selector matches all provided scopes. {@code false} otherwise.
 */
function selectorMatchesAllScopes(selector, scopes, useCache) {
  if (!selector) return false;
  if (selector === '*') return true;
  if (useCache === false) {
    const selectorTokens = selector.trim().split(/[\t\s]+/);
    const match = selectorTokens.every(selector => selectorMatchesAnyScope(selector, scopes, useCache));
    return match;
  } else {
    let scopeChain = typeof scopes === 'string'
    ? scopes : ( Array.isArray(scopes) ? buildScopeChain(scopes) : '');

    const cachedMatch = getCachedMatch(selector, scopeChain, matchAllCacheNS);
    if (cachedMatch != null) {
      return cachedMatch;
    } else {
      const selectorTokens = selector.trim().split(/[\t\s]+/);
      const match = selectorTokens.every(selector => selectorMatchesAnyScope(selector, scopes, useCache));
      setCachedMatch(selector, scopeChain, match, matchAllCacheNS);
      return match;
    }
  }
}

/**
 * anySelectorMatchAllScopes - Return {@code true} if any provided selector
 * matches all provided scopes.
 * Relies on {@link selectorMatchesAllScopes} for selector matching but accepts
 * multiple comma separated selectors
 * Eg:
 *     anySelectorMatchAllScopes(
 *         '.source.js .string.quoted, .text.plain',
 *         '.source.js'
 *     ) => false
 *
 * @param  {string}         selectors Scope selectors. Comma-separated (,).
 * @param  {Array | string} scopes    Scope array or scope chain.
 * @param  {boolean}        useCache  Optional. indicates whether or not to use cache. Defaults to true.
 * @return {boolean}                  {@code true} f any selector matches all provided scopes. {@code false} otherwise.
 */
function anySelectorMatchAllScopes(selectors, scopes, useCache) {
  selectors = typeof selectors === 'string'
  ? selectors.split(',').map(s => s.trim())
  : (Array.isArray(selectors) ? selectors : []);
  return selectors.some( _selector => selectorMatchesAllScopes(_selector, scopes, useCache));
}
