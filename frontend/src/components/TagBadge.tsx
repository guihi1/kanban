import type { Tag } from '../models/types';

const TagBadge = ({ tag }: { tag: Tag }) => {
  return (
    <span className={`badge bg-${tag.color} me-1`}>
      {tag.title}
    </span>
  );
};

export default TagBadge;
