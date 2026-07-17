import type { Tag } from "../models/types";

const TagBadge = ({ tag }: { tag: Tag }) => {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider uppercase ${tag.color}`}
    >
      {tag.title}
    </span>
  );
};

export default TagBadge;
