import { useParams, useNavigate } from "react-router-dom";
import { useAdminBlogs, useAdminBlog } from "@/hooks/admin/use-admin-blogs";
import AdminBlogLayout from "@/components/admin/blog/AdminBlogLayout";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";

const BlogAdminEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blog, isLoading } = useAdminBlog(id);
  const { categories, createBlog, updateBlog } = useAdminBlogs();
  const isEdit = !!id;

  if (isEdit && isLoading) {
    return (
      <AdminBlogLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      </AdminBlogLayout>
    );
  }

  return (
    <AdminBlogLayout>
      <BlogPostForm
        blog={blog ?? null}
        categories={categories}
        onSave={async (data) => {
          if (isEdit && id) {
            await updateBlog({ id, blog: data });
          } else {
            const result = await createBlog(data as Parameters<typeof createBlog>[0]);
            navigate(`/admin/blogs/edit/${result.id}`);
          }
        }}
      />
    </AdminBlogLayout>
  );
};

export default BlogAdminEditor;
