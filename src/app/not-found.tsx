export const runtime = "edge";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "#fafafa",
      }}
    >
      <h1>404 — Not found</h1>
    </main>
  );
}
