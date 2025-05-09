import TCIApp from "@/components/TCIApp";
import { Suspense } from "react";

export default function LocalePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TCIApp />
    </Suspense>
  );
}
