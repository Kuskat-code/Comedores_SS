const items = [
  "Fotos autenticas",
  "Concurrencia en tiempo real",
  "Seguridad de zona",
  "Higiene verificada",
];

export default function IndicadoresConfianza() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border bg-white p-4 text-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
