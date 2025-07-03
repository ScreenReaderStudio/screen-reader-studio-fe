'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useResultStore } from '@/stores/useResultStore';

export default function ResultViewer() {
  const result = useResultStore((state) => state.result);

  if (!result || !Array.isArray(result.script) || result.script.length === 0) {
    return (
      <div className="flex h-[370px] items-center justify-center text-gray-500">
        코드를 입력하고 분석 버튼을 클릭하세요
      </div>
    );
  }

  return (
    <Tabs className="w-full" defaultValue="script">
      <TabsList className="mb-1.5 grid w-full grid-cols-2">
        <TabsTrigger value="script">스크린 리더 대본</TabsTrigger>
        <TabsTrigger value="issue">접근성 이슈</TabsTrigger>
      </TabsList>

      <TabsContent value="script" className="space-y-2">
        <div className="h-[324px] overflow-scroll">
          <ul className="space-y-2 text-sm text-gray-700">
            {result.script.map((item: string[], idx: number) => (
              <li key={idx} className="flex gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center">{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-md font-semibold">{item[1]}</div>
                  <div className="mt-1 text-sm text-gray-500">{item[0]}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="issue" className="space-y-2">
        <div className="h-[324px] overflow-scroll">
          {Object.keys(result.warnings).length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">발견된 접근성 이슈가 없습니다.</div>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700">
              {Object.entries(result.warnings as Record<string, string[]>).map(
                ([tag, messages]: [string, string[]]) => (
                  <li key={tag} className="rounded-md border-l-4 border-red-400 bg-red-50 p-3">
                    <div className="mb-1 font-semibold text-red-700">[{tag}]</div>
                    <ul className="space-y-1 text-red-800">
                      {messages.map((msg: string, idx: number) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
