import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <form action={loginAction} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded border p-2" />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded border p-2" />
        </div>

        <button className="w-full rounded bg-black py-2 text-white">Sign in</button>
      </form>

      <div className="mt-4 text-sm">
        <a className="underline" href="/forgot-password">Forgot password?</a>
      </div>
    </main>
  );
}