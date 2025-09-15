import { RegisterForm } from "@/modules/auth/registro.jsx";

export default function Registro() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <RegisterForm />
      </div>
    </div>
  );
}