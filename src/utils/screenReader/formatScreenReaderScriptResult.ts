export default function formatScreenReaderScriptResult(rawResults: string[]): string[][] {
  return rawResults.map((line) => {
    const [type, ...restParts] = line.split(': ');
    const restRaw = restParts.join(': ').trim();

    const placeholderMatch = restRaw.match(/\(placeholder: "(.*?)"\)/);
    const placeholder = placeholderMatch?.[1];

    const cleanedText = restRaw
      .replace(/\(placeholder: ".*?"\)/, '')
      .replace(/^"+|"+$/g, '')
      .trim();

    const content = cleanedText || placeholder || '';
    const result = [type, content];

    if (placeholder) {
      result.push(placeholder);
    }

    return result;
  });
}
