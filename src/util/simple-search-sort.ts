enum RelevanceScore {
  EXACT_MATCH = 10000,
  STARTS_WITH_PHRASE = 9000,
  INCLUDES_PHRASE = 8000,
  FIRST_TOKEN = 10,
  SECOND_TOKEN = 3,
  NTH_TOKEN = 1,
}

export const sortSearchResults = <T>(
  searchString: string,
  results: T[],
  getText: (t: T) => string,
) =>
  results
    .map((result) => evaluateResult(searchString, result, getText))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);

const evaluateResult = <T>(
  searchString: string,
  result: T,
  getText: (result: T) => string,
): { result: T; text: string; score: number } => {
  const text = getText(result).trim().toLowerCase();

  let score = 0;
  if (text === searchString) {
    score = RelevanceScore.EXACT_MATCH;
  } else if (text.startsWith(searchString)) {
    score = RelevanceScore.STARTS_WITH_PHRASE;
  } else if (text.includes(searchString)) {
    score = RelevanceScore.INCLUDES_PHRASE;
  } else {
    score = evaluateTokens(searchString, text);
  }

  return { result, text, score };
};

const evaluateTokens = (searchString: string, text: string) => {
  const tokens = searchString.split(/[ ,-]/);
  let score = 0;
  const weights = [
    RelevanceScore.FIRST_TOKEN,
    RelevanceScore.SECOND_TOKEN,
    RelevanceScore.NTH_TOKEN,
  ];
  const scoreByPosition = (token: string, idx: number) => {
    const value = weights[Math.min(idx, weights.length - 1)];
    if (text.includes(token)) {
      score += value;
    }
  };
  tokens.forEach(scoreByPosition);
  return score;
};
