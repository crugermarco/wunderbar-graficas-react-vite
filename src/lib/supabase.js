import { createClient } from '@supabase/supabase-js'

// Cliente para Rotaciones
export const supabaseRotaciones = createClient(
  'https://fnbqdsbobztfnsgmplbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYnFkc2JvYnp0Zm5zZ21wbGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Njg1ODcsImV4cCI6MjA5MTM0NDU4N30.aZTtyWAKpHsDZKdjF8asncMBUdG7r9UWFEJqcrHj3pk'
)

// Cliente para Asistencias
export const supabaseAsistencias = createClient(
  'https://nugcotirycssuavrbvdr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2NvdGlyeWNzc3VhdnJidmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTAzNzIsImV4cCI6MjA5MDcyNjM3Mn0.OdOu_dlOUght0kBoawmLvYrB8LIHFYwR2NEMhQ6HmJA'
)

// Cliente para Mantenimiento (solicitudes)
export const supabaseMantenimiento = createClient(
  'https://pvocemlngtffiiyacqyb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2b2NlbWxuZ3RmZmlpeWFjcXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDg2NTQsImV4cCI6MjA5MTQyNDY1NH0.N5SMwhrTyGieUR1YytMifpqTArxqiZKOd1H8DVlPfco'
)