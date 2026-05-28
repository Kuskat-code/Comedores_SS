import Link from "next/link";

export default function MapaPreview() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8">
      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Mapa comunitario</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explora puestos por categoria, precio y cercania.
        </p>
        <Link href="/mapa" className="mt-4 inline-block text-sm font-medium text-blue-600">
          Ir al mapa {`->`}
        </Link>
      </div>
    </section>
  );
}
