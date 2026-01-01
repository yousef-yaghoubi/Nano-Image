
import { Counter } from './Counter';

function ParentCounter() {
  return (
    <div className="flex justify-around items-center backgroundSecond p-2 md:p-5 border border-gray-300 dark:border-gray-700 rounded-3xl">
      <Counter count={140} title="Prompts" />
      <Counter count={270} title="Tags" />
      <Counter count={40} title="Likes" />
    </div>
  );
}

export default ParentCounter;
