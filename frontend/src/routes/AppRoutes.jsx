import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import ArticlesPage from '../pages/public/ArticlesPage.jsx';
import ArticleDetailPage from '../pages/public/ArticleDetailPage.jsx';
import CategoriesPage from '../pages/public/CategoriesPage.jsx';
import { AuthorPage, CategoryDetailPage, TagDetailPage } from '../pages/public/CollectionPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage, ResetPasswordPage } from '../pages/auth/PasswordPages.jsx';
import ProfilePage from '../pages/user/ProfilePage.jsx';
import BookmarksPage from '../pages/user/BookmarksPage.jsx';
import MyCommentsPage from '../pages/user/MyCommentsPage.jsx';
import WriterDashboard from '../pages/writer/WriterDashboard.jsx';
import WriterArticlesPage from '../pages/writer/WriterArticlesPage.jsx';
import ArticleEditorPage from '../pages/writer/ArticleEditorPage.jsx';
import ArticlePreviewPage from '../pages/writer/ArticlePreviewPage.jsx';
import WriterStatisticsPage from '../pages/writer/WriterStatisticsPage.jsx';
import EditorDashboard from '../pages/editor/EditorDashboard.jsx';
import ReviewListPage from '../pages/editor/ReviewListPage.jsx';
import ReviewDetailPage from '../pages/editor/ReviewDetailPage.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminArticlesPage from '../pages/admin/AdminArticlesPage.jsx';
import { AdminCategoriesPage, AdminTagsPage } from '../pages/admin/TaxonomyPage.jsx';
import AdminCommentsPage from '../pages/admin/AdminCommentsPage.jsx';
import AdminReportsPage from '../pages/admin/AdminReportsPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:slug" element={<CategoryDetailPage />} />
        <Route path="tags/:slug" element={<TagDetailPage />} />
        <Route path="authors/:username" element={<AuthorPage />} />
        <Route path="search" element={<ArticlesPage searchOnly />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfilePage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="my-comments" element={<MyCommentsPage />} />

          <Route element={<RoleRoute roles={['writer', 'editor', 'admin']} />}>
            <Route path="writer/dashboard" element={<WriterDashboard />} />
            <Route path="writer/articles" element={<WriterArticlesPage />} />
            <Route path="writer/articles/create" element={<ArticleEditorPage />} />
            <Route path="writer/articles/:id/edit" element={<ArticleEditorPage />} />
            <Route path="writer/articles/:id/preview" element={<ArticlePreviewPage />} />
            <Route path="writer/statistics" element={<WriterStatisticsPage />} />
          </Route>

          <Route element={<RoleRoute roles={['editor', 'admin']} />}>
            <Route path="editor/dashboard" element={<EditorDashboard />} />
            <Route path="editor/reviews" element={<ReviewListPage />} />
            <Route path="editor/reviews/:id" element={<ReviewDetailPage />} />
          </Route>

          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/users/:id" element={<AdminUsersPage />} />
            <Route path="admin/articles" element={<AdminArticlesPage />} />
            <Route path="admin/categories" element={<AdminCategoriesPage />} />
            <Route path="admin/tags" element={<AdminTagsPage />} />
            <Route path="admin/comments" element={<AdminCommentsPage />} />
            <Route path="admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
