import { CategoryManager } from "@/components/categories/category-manager";
import { getCategories, getPublicApiBaseUrl } from "@/lib/helpdesk-api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Категорії</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Керування довідником категорій, які використовуються при створенні та фільтрації заявок.
        </p>
      </div>

      <div className="mt-6">
        <CategoryManager categories={categories} apiBaseUrl={getPublicApiBaseUrl()} />
      </div>
    </div>
  );
}
