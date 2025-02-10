import { Message } from "@/components/form-message";
import AuthForm from "@/components/AuthForm";

export default function Login(props: { searchParams: Message }) {
  const { searchParams } = props;

  return <AuthForm searchParams={searchParams} type="login" />;
}
