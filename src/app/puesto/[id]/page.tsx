import PuestoCard from "@/components/Puesto/PuestoCard";
import { supabase } from "@/lib/supabase";
import type { Puesto } from "@/types";

type Props = { params: { id: string } };

export default async function PuestoDetallePage({ params }: Props) {
  let data: Puesto | null = null;
  let error: any = null;
  if (supabase) {
    const response = await supabase
      .from("puestos")
      .select("*")
      .eq("id", params.id)
      .single();
    data = response.data as Puesto;
    error = response.error;
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">No se encontro el puesto.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <PuestoCard puesto={data as Puesto} />
    </main>
  );
}
