import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-body'>
              <h2 className='card-title text-center mb-4'>Login</h2>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
