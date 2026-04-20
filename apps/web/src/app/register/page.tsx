import { AuthForms } from "@/components/auth/auth-forms";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AuthForms mode="register" />
    </div>
  );
}
