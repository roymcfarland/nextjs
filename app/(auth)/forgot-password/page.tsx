import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage({
  searchParams,
}: { searchParams: { sent?: string } }) {
  const sent = searchParams?.sent === "1";

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>

      {sent && (
        <p className="mt-4 rounded border p-3 text-sm">
          If an account exists for that email, a reset link has been sent.
        </p>
      )}

      <form action={forgotPasswordAction} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded border p-2" />
        </div>

        <button className="w-full rounded bg-black py-2 text-white">Send reset link</button>
      </form>

      <div className="mt-4 text-sm">
        <a className="underline" href="/login">Back to login</a>
      </div>
    </main>
  );
}