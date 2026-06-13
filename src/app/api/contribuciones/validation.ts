import { z } from 'zod';
import type { TipoContribucion } from '@/types';

/**
 * Validation schema for POST body to /api/contribuciones.
 */
export const contribucionSchema = z.object({
  puesto_id: z.string().nonempty(),
  tipo: z.enum([
    'confirmar_abierto',
    'reportar_cerrado',
    'actualizar_horario',
    'subir_foto',
    'corregir_precio',
  ]),
  datos: z.record(z.unknown()).optional(),
});
