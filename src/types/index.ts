export type Categoria =
  | "pupusas"
  | "desayunos"
  | "comedores"
  | "antojitos"
  | "fruta"
  | "bebidas"
  | "mariscos"
  | "otros";

export interface Puesto {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: Categoria;
  lat: number;
  lng: number;
  direccion?: string;
  municipio?: string;
  departamento: string;
  precio_min?: number;
  precio_max?: number;
  hora_apertura?: string;
  hora_cierre?: string;
  dias_abierto?: string[];
  nivel_higiene?: number;
  nivel_seguridad?: number;
  concurrencia_actual?: number;
  fotos?: string[];
  verificado: boolean;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface Resena {
  id: string;
  puesto_id: string;
  autor_nombre: string;
  calificacion: number;
  comentario?: string;
  precio_pagado?: number;
  foto_url?: string;
  volveria?: boolean;
  creado_en: string;
}

export type TipoContribucion =
  | "confirmar_abierto"
  | "reportar_cerrado"
  | "actualizar_horario"
  | "subir_foto"
  | "corregir_precio";

export interface FiltrosMapa {
  precioMax?: number;
  categorias?: Categoria[];
  soloCercanos?: boolean;
  soloAbiertos?: boolean;
  nivelSeguridadMin?: number;
}
