import { Link } from "react-router-dom";

import { DEFAULT_AVATAR } from "@/lib/constants";

function BlogCard({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  authorAvatar,
}) {
  return (
    <article className="group flex flex-col gap-4">
      <Link
        to={`/post/${id}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-brown-200 sm:aspect-[16/11]"
      >
        <img
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          src={image}
          alt={title}
        />
      </Link>
      <div className="flex flex-col">
        <span className="mb-3 inline-flex w-fit rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
          {category}
        </span>
        <Link to={`/post/${id}`}>
          <h2 className="mb-2 line-clamp-2 text-start font-poppins text-xl font-bold tracking-tight text-brown-900 transition-colors group-hover:text-brown-500">
            {title}
          </h2>
        </Link>
        <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-brown-600">
          {description}
        </p>
        <div className="flex items-center text-sm text-brown-600">
          <img
            className="mr-2 size-8 rounded-full object-cover"
            src={authorAvatar || DEFAULT_AVATAR}
            alt=""
          />
          <span className="font-medium text-brown-800">{author}</span>
          <span className="mx-2 text-brown-400" aria-hidden>
            |
          </span>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}

// card preview for a single blog post
export default BlogCard;
