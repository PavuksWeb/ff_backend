/* eslint-disable prettier/prettier */
const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'l',
  '!': 'l',
  '$': 's',
  '@': 'a',
  '3': 'e',
  '5': 's',
  '7': 't',
};

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[01!$@357]/g, (c) => LEET_MAP[c] ?? c)
    .replace(/(.)\1+/g, '$1');
}

export function tokenize(text: string): string[] {
  return text
    .split(/[^a-zA-Z0-9!@$]+/)
    .filter(Boolean)
    .map(normalizeWord);
}

export function findViolations(
  tokens: string[],
  rules: ModerationRule[],
): ModerationViolation[] {
  const violations: ModerationViolation[] = [];

  rules.forEach((rule) => {
    const w1 = normalizeWord(rule.w1);
    const w2 = normalizeWord(rule.w2);

    tokens.forEach((token, i) => {
      if (token !== w1 && token !== w2) return;

      tokens.forEach((other, j) => {
        if (i === j) return;

        const pair =
          (token === w1 && other === w2) || (token === w2 && other === w1);

        if (!pair) return;

        const distance = Math.abs(i - j) - 1;

        if (distance <= rule.maxDistance) {
          violations.push({
            rule,
            index1: i,
            index2: j,
            distance,
          });
        }
      });
    });
  });

  return violations;
}
