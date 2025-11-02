import Image from "next/image";

function Card({
  data,
}: {
  data: {
    id: string;
    image: string;
    title: string;
    prompt: string;
    likes: number;
  };
}) {
  return (
    <div className="w-72 h-72 overflow-hidden bg-gray-100 relative rounded-3xl rounded-tl-none group cursor-pointer">
      <div className="z-50! left-0 w-20 absolute text-sm font-medium bg-white h-8 rounded-br-md flex justify-center items-center likeBox">
        {data.likes} liked
      </div>
      <Image
        src={data.image}
        alt={data.title}
        loading="lazy"
        fill
        className="group-hover:scale-110 group-hover:blur-sm transition duration-700 z-10 object-cover"
      />

      <div className="font-normal text-center bg-white rounded-sm text-lg left-0 right-0 w-fit max-w-4/5 mx-auto absolute -bottom-8 group-hover:bottom-4 transition-all duration-700 z-40 p-1 opacity-0 group-hover:opacity-85 shadow-[0_0_10px_white]">
        {data.title}
      </div>
    </div>
  );
}

export default Card;
