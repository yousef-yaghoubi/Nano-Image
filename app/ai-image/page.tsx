import SendDataPage from "@/components/shared/SendDataPage";
import { Suspense } from "react";

function Page() {
  return (
    <div className="h-fit mt-2 gap-4 flex flex-col">
      <Suspense fallback={<p>Loading...</p>}>
        <SendDataPage />
      </Suspense>
    </div>
  );
}

export default Page;
