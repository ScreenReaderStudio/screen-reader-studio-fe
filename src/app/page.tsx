import Image from 'next/image';

import AccessibilityAnalyzer from '@/components/AccessibilityAnalyzer';
import ResultViewer from '@/components/ResultViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Image src="/code.svg" alt="코드 아이콘" width={24} height={24} priority />
              코드 입력
            </CardTitle>
            <CardDescription>React 또는 Next.js 컴포넌트 코드를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <AccessibilityAnalyzer />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Image src="/eye.svg" alt="결과 아이콘" width={24} height={24} priority />
              분석 결과
            </CardTitle>
            <CardDescription>스크린 리더 대본과 접근성 이슈를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <ResultViewer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
