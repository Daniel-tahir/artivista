import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HashScrollHandler from "@/components/HashScrollHandler";
import PageLoader from "@/components/performance/PageLoader";
import PerformanceProvider from "@/components/performance/PerformanceProvider";
import AdminSessionWatcher from "@/components/admin/AdminSessionWatcher";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = lazy(() => import("./pages/Index.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const BlogIndex = lazy(() => import("./pages/BlogIndex.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const ArtworkCategoryPage = lazy(() => import("./pages/ArtworkCategoryPage.tsx"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage.tsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.tsx"));
const BlogAdminList = lazy(() => import("./pages/admin/BlogAdminList.tsx"));
const BlogAdminEditor = lazy(() => import("./pages/admin/BlogAdminEditor.tsx"));
const ReviewsAdminPage = lazy(() => import("./pages/admin/ReviewsAdminPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PerformanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <HashScrollHandler />
          <AdminSessionWatcher />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/artwork/:slug" element={<ArtworkCategoryPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/blogs" element={<BlogAdminList />} />
                <Route path="/admin/blogs/new" element={<BlogAdminEditor />} />
                <Route path="/admin/blogs/edit/:id" element={<BlogAdminEditor />} />
                <Route path="/admin/testimonials" element={<ReviewsAdminPage />} />
              </Route>
              <Route path="/not-found" element={<NotFound />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </PerformanceProvider>
  </QueryClientProvider>
);

export default App;
