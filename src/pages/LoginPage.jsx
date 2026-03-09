import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useAuth } from '../hooks'

const loginSchema = z.object({
  username: z.string().min(3, 'Usuario mínimo 3 caracteres'),
  password: z.string().min(4, 'Contraseña mínima 4 caracteres'),
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const user = await login(values)
      toast.success(`Bienvenido/a ${user.firstName}`)
      const fallback = user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/user'
      navigate(location.state?.from || fallback, { replace: true })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <section className="container-xl py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h1 className="h3 fw-bold mb-3">Login por API</h1>
              <p className="text-muted small">
                Usuario de prueba admin en DummyJSON: <strong>emilys</strong> / <strong>emilyspass</strong>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Usuario</label>
                  <input className="form-control" {...register('username')} />
                  {errors.username && <small className="text-danger">{errors.username.message}</small>}
                </div>

                <div className="col-12">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-control" {...register('password')} />
                  {errors.password && <small className="text-danger">{errors.password.message}</small>}
                </div>

                <div className="col-12 d-grid">
                  <button className="btn btn-dark" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Validando...' : 'Entrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
