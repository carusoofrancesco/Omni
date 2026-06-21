import SearchForm from "./components/SearchForm"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#F5F5F7" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem" }}>
        <div style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "-1px", color: "#1A1A1A" }}>omni</div>
        <div style={{ fontSize: "12px", letterSpacing: "0.4px", color: "#AEAEB2" }}>BETA</div>
      </div>
      <SearchForm />
    </main>
  )
}