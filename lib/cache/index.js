const EscapeCharacterRegex = /[-!"#$%&'*+,/:;=?@|^~()<>{}[\]]/g
const cachedMatchesBySelector : {}
//'.source': ['.source.js', '.source.js string.quoted']

function getCachedMatch = (selector, scopeChain){
  const cachedMatchesByScopeChain = cachedMatchesBySelector[selector];
  return cachedMatchesByScopeChain ? cachedMatchesByScopeChain[scopeChain] : undefined;
}

function setCachedMatch = (selector, scopeChain, match) {
  let cachedMatchesByScopeChain = cachedMatchesBySelector[selector]
  if (!cachedMatchesByScopeChain) {
    cachedMatchesByScopeChain = {}
    cachedMatchesBySelector[selector] = cachedMatchesByScopeChain
  }
  cachedMatchesByScopeChain[scopeChain] = match
  return cachedMatchesByScopeChain[scopeChain];
}

function getSelectorForScopeChain(selectors, scopeChain) {
  const cachedMatch = getCachedMatch(selector, scopeChain);
  if (cachedMatch != null) {

  }
}

const selectorForScopeChain = (selectors, scopeChain) => {
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i]
    const cachedMatch = getCachedMatch(selector, scopeChain)
    if (cachedMatch != null) {
      if (cachedMatch) {
        return selector
      } else {
        continue
      }
    } else {
      const scopes = parseScopeChain(scopeChain)
      while (scopes.length > 0) {
        if (selector.matches(scopes)) {
          setCachedMatch(selector, scopeChain, true)
          return selector
        }
        scopes.pop()
      }
      setCachedMatch(selector, scopeChain, false)
    }
  }

  return null
}
