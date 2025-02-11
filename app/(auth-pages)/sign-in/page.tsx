import { Message } from "@/components/form-message";
import AuthForm from "@/components/AuthForm";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return <AuthForm searchParams={searchParams} type="login" />;
}
