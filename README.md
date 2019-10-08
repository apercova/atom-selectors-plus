# atom-selectors-plus
An [Atom selectors.js](https://github.com/atom/atom/blob/master/src/selectors.js) based selector utility with extra features

## Features  
- Added functionality to validate Atom's ScopeSelector as [ScopeSelector](https://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/#scope-selectors)  
  By default Atom's selectors.js `selectorMatchesAnyScope(selector, scopes)` validates only individual scopes. Eg. `.source.js` or `.string.quoted`.

  > For above example `.source.js` and `.string.quoted` are evaluated independently. Hence, nested selectors like `.source.js .string` evaluate to `false` which is a bit missleading if you expect to evaluate `ScopeSelector` included `*` selector.
  
  > Following is a comparison between `selectorMatchesAnyScope(selector, scopes)` and `selectorMatchesAllScopes(selector, scopes)` functions: 
  
  ```bash
  ScopeChain => .source.js .string.quoted.template
  scopes     => [source.js,string.quoted.template]

  ============================================================
  Testing anySelectorMatchAnyScope(selector, scopes) function 

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

  ============================================================
  Testing anySelectorMatchAllScopes(selector, scopes) function 

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
  
  ============================================================
  Testing selectorMatchesAnyScope VS selectorMatchesAllScopes

  scopeChain => '.source.js'
  selector   => '.source.js .string.quoted'

  selectorMatchesAnyScope(selector, scopeChain)   => true  // '.source.js' token matches scope chain
  selectorMatchesAllScopes(selector, scopeChain)  => false // No selector matches any scope. '.source.js .string.quoted selector' is more


  ============================================================
  Testing selectorMatchesAnyScope VS selectorMatchesAllScopes

  scopeChain => '.source.js'
  selector   => '.source.js .string.quoted, .text.plain';

  anySelectorMatchAnyScope(selector, scopeChain)   => true  // '.source.js' token matches scope chain 
  anySelectorMatchAllScopes(selector, scopeChain)  => false // No selector matches any scope. '.source.js .string.quoted selector' is more specifyc)
  ```
- Removed dependency with underscore-plus's `isSubset()` function implemented in the scipt as:  
```javascript
  function isSubset(subset, superset) {
    return (Array.isArray(subset) && Array.isArray(superset)) &&
            subset
            .filter(sub => superset.includes(sub))
            .length === subset.length;
  }
```
