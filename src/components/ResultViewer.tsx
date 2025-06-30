'use client';

import { useResultStore } from '@/stores/useResultStore';
import formatResultsForDisplay from '@/utils/format/formatResultsForDisplay';

export default function ResultViewer() {
  const result = useResultStore((state) => state.result);

  if (!result || !Array.isArray(result.script) || result.script.length === 0) {
    return (
      <div className="flex h-[370px] items-center justify-center text-gray-500">
        코드를 입력하고 분석 버튼을 클릭하세요
      </div>
    );
  }

  const formatted = formatResultsForDisplay(result.script);

  return (
    <div className="h-[370px] overflow-scroll">
      <ul className="space-y-2 text-sm text-gray-700">
        {formatted.map((item, idx) => (
          <div key={idx} className="flex gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">{idx + 1}</div>
            <div className="flex-1">
              <div className="text-md font-semibold">{item[1]}</div>
              <div className="mt-1 text-sm text-gray-500">{item[0]}</div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
