function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-amber-700 text-white py-3 rounded-lg">
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;