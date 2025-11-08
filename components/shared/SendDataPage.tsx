"use client";
import { Suspense, useEffect, useState } from "react";
import UploadImage from "./UploadImage";
import TeaxtArea from "./TextArea";
import { useSearchParams } from "next/navigation";
import getUniqePrompt from "@/services/getUniqePrompt";
import { PromptType } from "@/types/data";

function SendDataPage() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") as string;
  const [dataPrompt, setDataPrompt] = useState<PromptType | null>();

  useEffect(() => {
    const getPromptData = async () => {
      const prompt = await getUniqePrompt({ id: product });
      setDataPrompt(prompt);
    };

    if (!!product) getPromptData();
  }, [product]);

  return (
    <>
      <UploadImage />
      <Suspense fallback={<h1>product</h1>}>
        <TeaxtArea promptData={dataPrompt?.prompt} />
      </Suspense>
    </>
  );
}

export default SendDataPage;
