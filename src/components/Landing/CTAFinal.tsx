import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-14">
      <div className="flex flex-wrap gap-3">
        <Link href="/mapa" className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
          Buscar comida cerca
        </Link>
        <Link href="/agregar" className="rounded-lg border px-4 py-2">
          Agregar puesto
        </Link>
      </div>
    </section>
  );
}
