# atom-selectors-plus
An Atom selector library based on [Atom](https://github.com/atom/atom)'s [selectors.js](https://github.com/atom/atom/blob/master/src/selectors.js) script with extra features :muscle: :point_left:

### Features 
- :white_check_mark: Added functionality to validate Atom's ScopeSelector as [ScopeSelector](https://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/#scope-selectors)  
  By default Atom's selectors.js `selectorMatchesAnyScope(selector, scopes)` validates only individual scopes. Eg. `.source.js` or `.string.quoted`. For instance `.source.js` and `.string.quoted` are evaluated independently. Hence, nested selectors like `.source.js .string` evaluate to `false` which is a bit missleading if you expect to evaluate `ScopeSelector` included `*` selector.

  Following is a comparison between improved `selectorMatchesAnyScope(selector, scopes, useCache)` and `selectorMatchesAllScopes(selector, scopes, useCache)` functions: 
  ```bash
  ScopeChain => .source.js .string.quoted.template
  scopes     => [source.js,string.quoted.template]
  ============================================================
  Testing anySelectorMatchAnyScope(selectors, scopes, useCache) function 

  selector: [*, .text.plain]                                      => true
  selector: [.source, .text.plain]                                => true
  selector: [.source.js, .text.plain]                             => true
  selector: [.string.quoted, .text.plain]                         => true
  selector: [.source.js .string.quoted, .text.plain]              => true
  selector: [.xml.source .string.quoted.template, .text.plain]    => true
  selector: [.source .number, .text.plain]                        => true
  selector: [.source.js .number, .text.plain]                     => true
  selector: [.source.js .number, .text.plain, .source.js .string] => true
  ============================================================
  Testing anySelectorMatchAllScopes(selectors, scopes, useCache) function 

  selector: [*, .text.plain]                                      => true
  selector: [.source, .text.plain]                                => true
  selector: [.source.js, .text.plain]                             => true
  selector: [.string.quoted, .text.plain]                         => true
  selector: [.source.js .string.quoted, .text.plain]              => true
  selector: [.xml.source .string.quoted.template, .text.plain]    => false # False as it's not a valid class selector for ScopeChain
  selector: [.source .number, .text.plain]                        => false # False as it's not a valid class selector for ScopeChain
  selector: [.source.js .number, .text.plain]                     => false # False as it's not a valid class selector for ScopeChain
  selector: [.source.js .number, .text.plain, .source.js .string] => true
  ============================================================  
  ```

- :white_check_mark: Added `anySelectorMatchAnyScope(selectors, scopes, useCache)` and `anySelectorMatchAllScopes(selectors, scopes, useCache)` functions to suport comma-separated (`,`) selector groups for matching testing of the form: `.source.js .string.quoted, .text.xml .string.quoted`.  
  Following is a comparison between added `anySelectorMatchAnyScope(selectors, scopes, useCache)` and `anySelectorMatchAllScopes(selectors, scopes, useCache)` functions: 
  
  ```bash
  Testing selectorMatchesAnyScope(selectors, scopes, useCache) VS selectorMatchesAllScopes(selectors, scopes, useCache)
  ============================================================
  scopeChain => '.source.js'
  selector   => '.source.js .string.quoted'

  selectorMatchesAnyScope(selector, scopeChain)   => true  // '.source.js' token matches scope chain
  selectorMatchesAllScopes(selector, scopeChain)  => false // No selector matches any scope. '.source.js .string.quoted selector' is more

  Testing selectorMatchesAnyScope VS selectorMatchesAllScopes
  ============================================================
  scopeChain => '.source.js'
  selector   => '.source.js .string.quoted, .text.plain';

  anySelectorMatchAnyScope(selector, scopeChain)   => true  // '.source.js' token matches scope chain 
  anySelectorMatchAllScopes(selector, scopeChain)  => false // No selector matches any scope. '.source.js .string.quoted selector' is more specifyc)
  ```
- :white_check_mark: Added cache to improve performance on high-demand match operations.  
  Cache feature is a modified version of great [atom/autocomplete-plus](https://github.com/atom/autocomplete-plus)'s [scope-helpers.js](https://github.com/atom/autocomplete-plus/blob/master/lib/scope-helpers.js) :100: that allows to use cache namespaces.
  Cache is enabled by default by not passing `useCache` argument. To disable cache, pass `useCache` argument as `false`.  
  ```json
  {
    "mAny": {
      ".source.js .string.quoted": {
        ".source.js": true
      },
      ".source.js": {
        ".source.js": true
      },
      ".string.quoted": {
        ".source.js": false
      },
      ".text.plain": {
        ".source.js": false
      }
    },
    "mAll": {
      ".source.js .string.quoted": {
        ".source.js": false
      },
      ".text.plain": {
        ".source.js": false
      }
    }
  }
  ```
- :white_check_mark: Removed dependency with underscore-plus's `isSubset()` function implemented in the script as:  
```javascript
  function isSubset(subset, superset) {
    return (Array.isArray(subset) && Array.isArray(superset)) &&
            subset
            .filter(sub => superset.includes(sub))
            .length === subset.length;
  }
```
