import AdminBlogLayout from "@/components/admin/blog/AdminBlogLayout";
import BlogCategoryManager from "@/components/admin/blog/BlogCategoryManager";
import { useAdminBlogs } from "@/hooks/admin/use-admin-blogs";

const BlogAdminCategories = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useAdminBlogs();

  return (
    <AdminBlogLayout>
      <BlogCategoryManager
        categories={categories}
        onCreate={createCategory}
        onUpdate={(id, cat) => updateCategory({ id, cat })}
        onDelete={deleteCategory}
      />
    </AdminBlogLayout>
  );
};

export default BlogAdminCategories;
