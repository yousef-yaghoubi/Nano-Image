"use client";
import Modal from "@/components/shared/Modal";
import TeaxtArea from "@/components/shared/TextArea";
import UploadImage from "@/components/shared/UploadImage";
import { useRouter } from "next/navigation";
import { Suspense, use } from "react";

function Page({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const router = useRouter();
  const {prompt} = use(searchParams)
  return (
    <Modal open onClose={() => router.push("/")}>
      <div className="h-fit mt-2 gap-4 flex flex-col">
        <UploadImage />
        <Suspense fallback={<div>prompt</div>}>
          <TeaxtArea promptData={prompt} />
        </Suspense>
      </div>
    </Modal>
  );
}

export default Page;
