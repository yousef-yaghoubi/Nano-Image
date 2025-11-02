import Card from "@/components/shared/Card";

export default async function Home() {
  const data = await fetch(`${process.env.API_PROMPT}/api/prompts`).then(
    (res) => res.json()
  );

  return (
    <div className="font-extrabold text-3xl">
      <div className="w-full grid grid-cols-4 gap-10 justify-items-center">
        {data.items.map(
          (item: {
            image: string;
            id: string;
            prompt: string;
            title: string;
            likes: number;
          }) => (
            <Card data={item} key={item.id} />
          )
        )}
      </div>
    </div>
  );
}
