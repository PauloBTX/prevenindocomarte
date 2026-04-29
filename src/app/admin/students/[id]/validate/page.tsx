import * as React from "react"
import { StudentValidationView } from "./student-validation-view"

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ]
}

export default async function StudentValidationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <StudentValidationView id={id} />
    </React.Suspense>
  )
}
