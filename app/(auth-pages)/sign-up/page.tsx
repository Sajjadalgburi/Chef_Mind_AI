import AuthForm from "@/components/AuthForm";
import { Message } from "@/components/form-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams; // Await the promise to resolve

  return <AuthForm searchParams={searchParams} type="register" />;
}
