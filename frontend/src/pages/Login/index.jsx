import { LoginForm } from "@/modules/auth/login.jsx"

export default function Login() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}