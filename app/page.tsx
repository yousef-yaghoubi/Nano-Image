import Card from "@/components/shared/Card";

export default async function Home() {
  const data = await fetch(`${process.env.API_PROMPT}/api/prompts`).then(
    (res) => res.json()
  );

  return (
    <div className="font-extrabold text-3xl">
      <div className="w-full grid grid-cols-4 justify-items-center">
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

      {/* <div className="grid grid-cols-3 gap-6 auto-rows-min">
        <div className="bg-gray-400 rounded p-2">
          <img src="image1.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">1</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image2.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">2</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image3.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">3</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image4.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">4</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image5.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">5</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image6.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">6</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image7.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">7</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image8.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">8</div>
        </div>
        <div className="bg-gray-400 rounded p-2">
          <img src="image9.jpg" alt="" className="w-full h-auto mb-2" />
          <div className="text-center font-bold">9</div>
        </div>
      </div> */}
    </div>
  );
}
