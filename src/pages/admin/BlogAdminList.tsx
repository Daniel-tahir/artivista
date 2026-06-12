import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AdminBlogLayout from "@/components/admin/blog/AdminBlogLayout";
import BlogPostTable from "@/components/admin/blog/BlogPostTable";
import { useAdminBlogs } from "@/hooks/admin/use-admin-blogs";
import type { Blog } from "@/types/content";

const BlogAdminList = () => {
  const navigate = useNavigate();
  const { blogs, categories, deleteBlog, duplicateBlog } = useAdminBlogs();
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget.id);
    } catch {
      // error handled by hook
    }
    setDeleteTarget(null);
  };

  return (
    <AdminBlogLayout>
      <BlogPostTable
        blogs={blogs}
        categories={categories}
        onEdit={(blog) => navigate(`/admin/blogs/edit/${blog.id}`)}
        onDelete={setDeleteTarget}
        onDuplicate={(blog) => duplicateBlog(blog.id)}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/[0.05] text-foreground hover:bg-white/[0.08]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminBlogLayout>
  );
};

export default BlogAdminList;
