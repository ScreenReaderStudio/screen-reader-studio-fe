import { NextRequest } from 'next/server';

import detectAccessibilityWarnings from '@/utils/accessibility/detectAccessibilityWarnings';
import formatAccessibilityIssueResult from '@/utils/accessibility/formatAccessibilityIssueResult';
import analyzeHTMLWithJsdom from '@/utils/dom/analyzeHTMLWithJsdom';
import formatScreenReaderScriptResult from '@/utils/screenReader/formatScreenReaderScriptResult';
import generateScreenReaderScript from '@/utils/screenReader/generateScreenReaderScript';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const extracted = analyzeHTMLWithJsdom(html);
    const rawScript = generateScreenReaderScript(extracted);
    const script = formatScreenReaderScriptResult(rawScript);
    const rawWarnings = detectAccessibilityWarnings(extracted);
    const warnings = formatAccessibilityIssueResult(rawWarnings);

    return new Response(JSON.stringify({ script, warnings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: 'Failed to fetch HTML' }), {
      status: 500,
    });
  }
}
