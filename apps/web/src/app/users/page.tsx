import { UserManager } from "@/components/users/user-manager";
import { getPublicApiBaseUrl, getUsers } from "@/lib/helpdesk-api";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Користувачі</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Перегляд таблиці users та створення нових записів безпосередньо через API.
        </p>
      </div>

      <div className="mt-6">
        <UserManager users={users} apiBaseUrl={getPublicApiBaseUrl()} />
      </div>
    </div>
  );
}
