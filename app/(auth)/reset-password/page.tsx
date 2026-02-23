import { resetPasswordAction } from "./actions";

export default function ResetPasswordPage({
  searchParams,
}: { searchParams: { token?: string } }) {
  const token = searchParams?.token ?? "";

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>

      <form action={resetPasswordAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />

        <div>
          <label className="text-sm">New password</label>
          <input
            name="password"
            type="password"
            required
            minLength={12}
            className="mt-1 w-full rounded border p-2"
          />
          <p className="mt-1 text-xs text-gray-600">Minimum 12 characters.</p>
        </div>

        <button className="w-full rounded bg-black py-2 text-white">Update password</button>
      </form>

      <div className="mt-4 text-sm">
        <a className="underline" href="/login">Back to login</a>
      </div>
    </main>
  );
}