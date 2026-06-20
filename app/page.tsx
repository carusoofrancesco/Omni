import SearchForm from "./components/SearchForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Omni</h1>
        <p className="mt-3 text-gray-500">Scopri quanto è visibile la tua attività online</p>
      </div>
      <SearchForm />
    </main>
  )
}