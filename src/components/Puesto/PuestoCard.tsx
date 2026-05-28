import type { Puesto } from "@/types";

type Props = { puesto: Puesto };

export default function PuestoCard({ puesto }: Props) {
  const precioLabel = puesto.precio_min
    ? `$${puesto.precio_min.toFixed(2)}${puesto.precio_max ? ` - $${puesto.precio_max.toFixed(2)}` : ""}`
    : "Precio no reportado";

  const concurrenciaLabel = ["Vacio", "Normal", "Lleno"][puesto.concurrencia_actual ?? 0];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {puesto.fotos?.[0] && (
        <img
          src={puesto.fotos[0]}
          alt={puesto.nombre}
          className="mb-3 h-40 w-full rounded-lg object-cover"
        />
      )}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{puesto.nombre}</h3>
        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
          {puesto.categoria}
        </span>
      </div>
      <p className="mb-3 text-lg font-bold text-green-700">{precioLabel}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-base">{`★`.repeat(puesto.nivel_higiene ?? 0)}</div>
          <div className="text-gray-500">Higiene</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-base">{`🛡️`.repeat(Math.min(puesto.nivel_seguridad ?? 0, 3))}</div>
          <div className="text-gray-500">Zona</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-base font-medium text-gray-700">{concurrenciaLabel}</div>
          <div className="text-gray-500">Ahora</div>
        </div>
      </div>
    </div>
  );
}
