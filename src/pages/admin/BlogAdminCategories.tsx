import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBlogLayout from "@/components/admin/blog/AdminBlogLayout";

const BlogAdminCategories = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/blogs", { replace: true });
  }, [navigate]);

  return (
    <AdminBlogLayout>
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Redirecting...
      </div>
    </AdminBlogLayout>
  );
};

export default BlogAdminCategories;
