'use client';

import { useMemo } from 'react';

import { useAnalysisStore } from '@/stores/useAnalysisStore';

const impactStyles: { [key: string]: { container: string; badge: string; title: string } } = {
  critical: {
    container: 'border-red-300 bg-red-50',
    badge: 'bg-red-100 text-red-800 border-transparent hover:bg-red-200/60',
    title: 'text-red-900',
  },
  serious: {
    container: 'border-orange-300 bg-orange-50',
    badge: 'bg-orange-100 text-orange-800 border-transparent hover:bg-orange-200/60',
    title: 'text-orange-900',
  },
  moderate: {
    container: 'border-yellow-300 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-800 border-transparent hover:bg-yellow-200/60',
    title: 'text-yellow-900',
  },
  minor: {
    container: 'border-gray-200 bg-white',
    badge: 'bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200/60',
    title: 'text-gray-900',
  },
};

export default function IssuesList({ onNodeClick }: { onNodeClick: (selector: string) => void }) {
  const { analysisResult, isLoading, error } = useAnalysisStore();
  const sortedViolations = useMemo(() => {
    if (!analysisResult?.violations) {
      return [];
    }

    const impactOrder: { [key: string]: number } = {
      critical: 0,
      serious: 1,
      moderate: 2,
      minor: 3,
    };

    return analysisResult.violations.slice().sort((a, b) => {
      const impactA = a.impact ? impactOrder[a.impact] : 99;
      const impactB = b.impact ? impactOrder[b.impact] : 99;
      return impactA - impactB;
    });
  }, [analysisResult]);

  if (isLoading) {
    return <p>접근성 이슈를 분석 중입니다...</p>;
  }
  if (error) {
    return <p className="text-red-600">오류: {error}</p>;
  }
  if (!analysisResult || sortedViolations.length === 0) {
    return <p>발견된 접근성 이슈가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">총 {sortedViolations.length}개의 위반 사항 발견</p>
      <ul className="space-y-3">
        {sortedViolations.map((violation) => {
          const styles = impactStyles[violation.impact || 'minor'] || impactStyles.minor;

          return (
            <li
              key={violation.id}
              className={`rounded-md border p-4 shadow-sm ${styles.container}`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className={`font-semibold ${styles.title}`}>{violation.help}</p>
                <div className={`shrink-0 capitalize ${styles.badge}`}>{violation.impact}</div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{violation.description}</p>
              <a
                href={violation.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-blue-500 hover:underline"
              >
                자세히 보기
              </a>
              <div className="mt-3 space-y-2">
                <h4 className="text-sm font-semibold">영향 요소:</h4>
                {violation.nodes.map((node, nodeIndex) => {
                  const target = node.target;
                  const selector = Array.isArray(target) ? target[0] : target;

                  if (typeof selector !== 'string') {
                    return (
                      <div
                        key={nodeIndex}
                        className="rounded bg-gray-50 p-2 font-mono text-xs break-all"
                      >
                        <code>{node.html}</code>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={nodeIndex}
                      className="cursor-pointer rounded bg-gray-50 p-2 font-mono text-xs break-all transition-colors hover:bg-gray-100"
                      onClick={() => onNodeClick(selector)}
                    >
                      <code>{node.html}</code>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
