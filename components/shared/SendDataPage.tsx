'use client';
import { Suspense, useEffect, useState } from 'react';
import UploadImage from './UploadImage';
import TeaxtArea from './TextArea';
import { useSearchParams } from 'next/navigation';
import getUniqePrompt from '@/services/getUniqePrompt';
import { PromptType } from '@/types/data';
import { FileWithPreview } from '@/hooks/use-file-upload';
import { Button } from '../ui/button';
import Image from 'next/image';
import { fileToBase64 } from '@/lib/fileToBase64';

function SendDataPage() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product') as string;

  const [dataPrompt, setDataPrompt] = useState<PromptType | null>(null);
  const [images, setImages] = useState<FileWithPreview[] | null>(null);
  const [newData, setNewData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch prompt
  useEffect(() => {
    if (!product) return;
    const getPromptData = async () => {
      const prompt = await getUniqePrompt({ id: product });
      setDataPrompt(prompt);
    };
    getPromptData();
  }, [product]);

  const conditionOfSendData = dataPrompt !== null && !!images?.length;

  const handleSendData = async () => {
    if (!conditionOfSendData || !images?.[0] || !dataPrompt) return;
    setLoading(true);
    try {
      const base64Image = await fileToBase64(images[0].file as File);
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: dataPrompt.prompt,
          imageBase64: base64Image,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const result = await res.json();
      console.log(result)
      setNewData(result.text as string); // Store the text response
    } catch (err) {
      console.error('Error generating image:', err);
      setNewData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UploadImage onFilesChange={setImages} />

      <Suspense fallback={<h1>Loading prompt...</h1>}>
        <TeaxtArea promptData={dataPrompt?.prompt} />
      </Suspense>

      <Button
        className="h-10 w-40 font-bold text-lg md:text-xl"
        disabled={!conditionOfSendData || loading}
        onClick={handleSendData}
      >
        {loading ? 'Loading...' : 'Send Data'}
      </Button>

      {loading && <p className="text-4xl font-black mt-4">Loading</p>}

      {newData && !loading && (
        <Image src={newData.trim()} alt="Generated Image" className="mt-10" width={400} height={400} />
      )}
    </>
  );
}

export default SendDataPage;
