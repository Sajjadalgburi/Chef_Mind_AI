import AuthForm from "@/components/AuthForm";
import { FormMessage, Message } from "@/components/form-message";

export default function Signup(props: { searchParams: Message }) {
  const { searchParams } = props;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return <AuthForm searchParams={searchParams} type="register" />;
}
