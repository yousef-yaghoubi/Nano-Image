import ShowPromptsContainer from '@/components/shared/Prompts/ShowPromptsContainer';

type ShowPromptsWrapperProps = {
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
  limit?: number;
};

const ShowPromptsWrapper = ({
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  head,
  desc,
  limit = 12,
}: ShowPromptsWrapperProps) => {
  return (
    <ShowPromptsContainer
      gridClass={gridClass}
      showSimple={showSimple}
      head={head}
      desc={desc}
      limit={limit}
    />
  );
};

export default ShowPromptsWrapper;
