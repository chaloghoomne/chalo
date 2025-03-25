import { Link } from "react-router-dom"

const BlogCard = ({ blog }) => {
  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Image container with overlay for reading time */}
      <div className="relative overflow-hidden group">
        <img
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          src={blog.imageUrl || "/placeholder.svg"}
          alt={blog.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Reading time badge */}
        <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {blog.readingTime} min read
        </div>
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Publisher and date */}
        <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
          <span className="font-medium">{blog.publisher}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
          <Link to={`/blog/${generateSlug(blog.title)}-${blog._id}`}>{blog.title}</Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{blog?.description?.substring(4).trim()}</p>

        {/* Read more link */}
        <Link
          to={`/blog/${generateSlug(blog.title)}-${blog._id}`}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          Read more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default BlogCard

