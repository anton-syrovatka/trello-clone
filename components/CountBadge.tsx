import { Task } from "@/typings";
import { memo } from "react";

type BadgeProps = {
  searchTerm: string;
  tasks: Task[];
};

const CountBadge = ({ searchTerm, tasks }: BadgeProps) => {
  return (
    <span className="text-gray-500 bg-gray-200 rounded-full px-2.5 py-1 text-sm font-normal">
      {!searchTerm
        ? tasks.length
        : tasks.filter((task) =>
            task.title
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          ).length}
    </span>
  );
};

export default memo(CountBadge);
