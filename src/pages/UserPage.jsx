import { useAuth } from '../hooks'

function UserPage() {
  const { user } = useAuth()

  return (
    <section className="container-xl py-4 py-md-5">
      <h1 className="page-title fw-bold mb-4">Panel de usuario</h1>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <strong>Nombre:</strong> {user?.firstName} {user?.lastName}
            </div>
            <div className="col-12 col-md-6">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="col-12 col-md-6">
              <strong>Usuario:</strong> {user?.username}
            </div>
            <div className="col-12 col-md-6">
              <strong>Rol:</strong> {user?.role || 'user'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserPage
