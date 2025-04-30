const dummy = () => {
  return 1
}

const totalLikes = (blogsList = [] ) => {
  return blogsList.reduce((acc, { likes }) => acc + likes, 0)
}

const favoriteBlog = (blogsList = [] ) => {
  return blogsList
    .slice()
    .sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (blogsList = [] ) => {
  const blogsListOrder = blogsList
    .slice()
    .sort((a, b) => b.blogs - a.blogs)

  return blogsListOrder.length === 0
    ? 0
    : blogsListOrder[0].blogs || 0
}

const mostLikesAuthor = (blogsList = [] ) => {
  const blogsListOrder = blogsList
    .slice()
    .sort((a, b) => b.likes - a.likes)

  return blogsListOrder.length === 0
    ? null
    : {
      author: blogsListOrder[0].author,
      likes: blogsListOrder[0].likes,
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesAuthor,
}
