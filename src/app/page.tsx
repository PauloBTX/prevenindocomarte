import { redirect } from "next/navigation"

export default function Home() {
  // Redireciona imediatamente para o login já que não existe homepage pública prevista
  redirect("/login")
}
