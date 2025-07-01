export default function formatAccessibilityIssueResult(
  warnings: unknown
): Record<string, string[]> {
  if (!Array.isArray(warnings)) {
    return {};
  }

  return warnings.reduce<Record<string, string[]>>((acc, warning) => {
    if (typeof warning !== 'string') {
      return acc;
    }

    const match = warning.match(/^\[(\w+)]\s(.+)$/);
    if (!match) {
      return acc;
    }

    const [, tag, message] = match;
    if (!acc[tag]) {
      acc[tag] = [];
    }

    acc[tag].push(message.replace(/\\"/g, '"'));

    return acc;
  }, {});
}
