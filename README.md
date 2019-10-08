# atom-selectors-plus
An [Atom selectors.js](https://github.com/atom/atom/blob/master/src/selectors.js) based selector utility with extra features

## Features  
- Added functionality to validate Atom's ScopeSelector as [ScopeSelector](https://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/#scope-selectors)  
  By default Atom's selectors.js `selectorMatchesAnyScope(selector, scopes)` validates only individual scopes. Eg. `.source.js` or `.string.quoted`.

  > For above example `.source.js` and `.string.quoted` are evaluated independently. Hence, nested selectors like `.source.js .string` evaluate to `false` which is a bit missleading if you expect to evaluate `ScopeSelector` included `*` selector.
  
  > Following is a comparison between `selectorMatchesAnyScope(selector, scopes)` and `selectorMatchesAllScopes(selector, scopes)` functions: 
  
  ```bash
  ScopeChain    => '.source.js .string.quoted'
  Scopes        => [source.js,string.quoted]

  ============================================================
  Testing selectorMatchesAnyScope(selector, scopes)
  ============================================================

   selector: [*]                         => false
   selector: [.source.js]                => true
   selector: [.string.quoted]            => true
   selector: [.source.js .string.quoted] => false
   selector: [.source .string]           => false
   selector: [.source .quoted]           => false
   selector: [.source .string.quoted]    => false
   selector: [.source .quoted.string]    => false
   selector: [.js .string]               => false
   selector: [.js .quoted]               => false
   selector: [.js .string.quoted]        => false
   selector: [.js .quoted.string]        => false
   selector: [.source.js .string]        => false
   selector: [.source.js .quoted]        => false
   selector: [.source.js .string.quoted] => false
   selector: [.source.js .quoted.string] => false
   selector: [.js .string]               => false
   selector: [.js.source .string]        => false
   selector: [.js.source .quoted]        => false
   selector: [.js.source .string.quoted] => false
   selector: [.js.source.string]         => false
   selector: [.js.source.quoted]         => false
   selector: [.js.string.quoted]         => false
   selector: [.js.source.string.quoted]  => false
  ```
  ```bash
  ============================================================
  Testing selectorMatchesAnyScopes(selector, scopes)
  ============================================================

   selector: [*]                         => true
   selector: [.source.js]                => true
   selector: [.string.quoted]            => true
   selector: [.source.js .string.quoted] => true
   selector: [.source .string]           => true
   selector: [.source .quoted]           => true
   selector: [.source .string.quoted]    => true
   selector: [.source .quoted.string]    => true
   selector: [.js .string]               => true
   selector: [.js .quoted]               => true
   selector: [.js .string.quoted]        => true
   selector: [.js .quoted.string]        => true
   selector: [.source.js .string]        => true
   selector: [.source.js .quoted]        => true
   selector: [.source.js .string.quoted] => true
   selector: [.source.js .quoted.string] => true
   selector: [.js .string]               => true
   selector: [.js.source .string]        => true
   selector: [.js.source .quoted]        => true
   selector: [.js.source .string.quoted] => true
   selector: [.js.source.string]         => false # False as it's not a valid class selector for ScopeChain
   selector: [.js.source.quoted]         => false # False as it's not a valid class selector for ScopeChain
   selector: [.js.string.quoted]         => false # False as it's not a valid class selector for ScopeChain
   selector: [.js.source.string.quoted]  => false # False as it's not a valid class selector for ScopeChain
  ============================================================
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