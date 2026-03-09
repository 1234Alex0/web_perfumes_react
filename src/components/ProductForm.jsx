import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  price: z.coerce.number().positive('Debe ser mayor que 0'),
  category: z.string().min(2, 'Categoría requerida'),
  thumbnail: z.string().url('URL no válida').optional().or(z.literal('')),
})

const defaultValues = {
  title: '',
  description: '',
  price: '',
  category: '',
  thumbnail: '',
}

function ProductForm({ initialData, onSubmit, submitLabel, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || '',
        thumbnail: initialData.thumbnail || '',
      })
    } else {
      reset(defaultValues)
    }
  }, [initialData, reset])

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <label className="form-label">Título</label>
        <input className="form-control" {...register('title')} />
        {errors.title && <small className="text-danger">{errors.title.message}</small>}
      </div>

      <div className="col-12">
        <label className="form-label">Descripción</label>
        <textarea className="form-control" rows="3" {...register('description')} />
        {errors.description && <small className="text-danger">{errors.description.message}</small>}
      </div>

      <div className="col-md-4 col-12">
        <label className="form-label">Precio</label>
        <input className="form-control" type="number" step="0.01" {...register('price')} />
        {errors.price && <small className="text-danger">{errors.price.message}</small>}
      </div>

      <div className="col-md-4 col-12">
        <label className="form-label">Categoría</label>
        <input className="form-control" {...register('category')} />
        {errors.category && <small className="text-danger">{errors.category.message}</small>}
      </div>

      <div className="col-md-4 col-12">
        <label className="form-label">Imagen (URL)</label>
        <input className="form-control" {...register('thumbnail')} />
        {errors.thumbnail && <small className="text-danger">{errors.thumbnail.message}</small>}
      </div>

      <div className="col-12 d-grid d-sm-block">
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
