
/blog/
    pages/
    components/
    hooks/
    services/
    utils/


GET /api/blogs
  - query: page, limit, search, status, tags
  - response:
    {
      data: Blog[],
      meta: { page, limit, total }
    }


<!-- https://chatgpt.com/g/g-p-68b9cdeee6648191b09c4aff4e47cac8/c/6981ab79-a128-8320-a850-938d218331f1 -->

folder structure:

src/
└── features/
    └── blog/
        ├── pages/
        │   ├── BlogListPage.jsx        # list, filter, search, pagination
        │   ├── BlogDetailPage.jsx      # read blog, views, reactions, comments
        │   ├── BlogEditorPage.jsx      # create / edit blog
        │   └── MyBlogsPage.jsx         # author dashboard (draft/published)
        │
        ├── components/
        │   ├── list/
        │   │   ├── BlogCard.jsx
        │   │   ├── BlogCardSkeleton.jsx
        │   │   └── BlogFilterBar.jsx
        │   │
        │   ├── detail/
        │   │   ├── BlogHeader.jsx
        │   │   ├── BlogContent.jsx
        │   │   ├── BlogMeta.jsx
        │   │   ├── BlogReactions.jsx   # like/react
        │   │   └── BlogActions.jsx     # edit/delete (permission-based)
        │   │
        │   ├── comment/
        │   │   ├── CommentList.jsx
        │   │   ├── CommentItem.jsx
        │   │   ├── CommentForm.jsx
        │   │   └── CommentActions.jsx  # edit/delete/reply
        │   │
        │   └── common/
        │       ├── EmptyState.jsx
        │       ├── LoadMoreButton.jsx
        │       └── ErrorState.jsx
        │
        ├── hooks/
        │   ├── useBlogs.js              # list, filter, search
        │   ├── useBlog.js               # single blog
        │   ├── useTrendingBlogs.js
        │   ├── useBlogReactions.js
        │   └── useComments.js           # blog + comment comments
        │
        ├── services/
        │   ├── blog.api.js
        │   ├── comment.api.js
        │   └── reaction.api.js
        │
        ├── utils/
        │   ├── blogPermissions.js       # canEdit, canDelete
        │   ├── commentRules.js          # 15-day edit rule
        │   ├── buildBlogQuery.js        # filter/search query builder
        │   └── viewTracker.js           # debounce view count
        │
        ├── constants/
        │   ├── blogStatus.js
        │   ├── reactionTypes.js
        │   └── filters.js
        │
        ├── types/
        │   ├── blog.types.js
        │   ├── comment.types.js
        │   └── reaction.types.js
        │
        └── index.js                     # public exports
