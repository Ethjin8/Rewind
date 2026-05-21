export default function Account() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Account</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Profile</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          <p>Username: placeholder</p>
          {/* <p>Email: placeholder@example.com</p> */}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Settings</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          <p>Background: default</p>
        </div>
      </section>
      <button className="bg-blue-400 text-white px-4 py-2 rounded text-sm">Sign Out</button>
    </div>
  );
}
