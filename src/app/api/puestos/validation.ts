import { z } from 'zod';

/**
 * Validation schema for GET query parameters on /api/puestos.
 * All parameters are optional but, when present, must be of the correct type.
 */
export const puestosQuerySchema = z.object({
  precioMax: z.string().optional().transform((val) => (val ? Number(val) : undefined)).refine((val) => val === undefined || !Number.isNaN(val), { message: 'precioMax must be a numeric value' }),
  categoria: z.string().optional(),
  lat: z.string().optional().transform((val) => (val ? Number(val) : undefined)).refine((val) => val === undefined || !Number.isNaN(val), { message: 'lat must be a numeric value' }),
  lng: z.string().optional().transform((val) => (val ? Number(val) : undefined)).refine((val) => val === undefined || !Number.isNaN(val), { message: 'lng must be a numeric value' }),
  radio: z.string().optional().transform((val) => (val ? Number(val) : undefined)).refine((val) => val === undefined || !Number.isNaN(val), { message: 'radio must be a numeric value' }),
});
