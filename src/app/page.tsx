import Image from 'next/image';

import ClientEditorWrapper from '@/components/ClientEditorWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="mt-20">
      <Card>
        <CardHeader>
          <CardTitle>
            <Image src="/code.svg" alt="코드 아이콘" width={24} height={24} priority />
            코드 입력
          </CardTitle>
          <CardDescription>React 또는 Next.js 컴포넌트 코드를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientEditorWrapper />
        </CardContent>
      </Card>
    </div>
  );
}
