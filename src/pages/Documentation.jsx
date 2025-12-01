import React from "react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Project Documentation</h1>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Summary</h2>
        <p className="text-gray-300">
        You will build a full-stack API Testing Tool that allows users to:
Enter an API URL


Select HTTP method (GET, POST, PUT, DELETE, PATCH)


Add headers, params, and request body JSON


Send the request


See the response status, headers, and body


Save request history


Save API collections (like Postman folders)


User authentication (optional)


This will be a production-level project that showcases frontend–backend communication, API proxying, database usage, and UI design.
</p>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Authentication (Login, Signup, Forgot & Reset Password)</li>
          <li>Environment Manager (Add/Edit/Delete)</li>
          <li>API Request Builder (GET/POST/PUT/DELETE)</li>
          <li>Response Viewer with JSON formatting</li>
          <li>Request History (Load previous requests)</li>
          <li>Add collections</li>
          <li>Encoding and decoding</li>

        </ul>
      </section>
       {/* Tech Stack */}
       <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Teck Stack</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Frontend → React + Vite + Tailwind Css</li>
          <li>Backend → Node.js + Express </li>
          <li> Database → Supabase  </li>
          <li></li>

          

        </ul>
      </section>

      {/* Screenshots */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Screenshots</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <img src="/screenshots/Screenshot 2025-12-01 113417.png" alt="Login Page" className="rounded-lg shadow-lg" />
          <img src="/screenshots/Screenshot 2025-12-01 114755.png" alt="Dashboard" className="rounded-lg shadow-lg" />
          <img src="/screenshots/Screenshot 2025-12-01 113625.png" alt="Dashboard" className="rounded-lg shadow-lg" />
          <img src="/screenshots/Screenshot 2025-12-01 113541.png" alt="Dashboard" className="rounded-lg shadow-lg" />

         
          <img src="/screenshots/Screenshot 2025-12-01 113556.png" className="rounded-lg shadow-lg" />
          <img src="/screenshots/Screenshot 2025-12-01 113439.png" alt="Reset Password" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Demo Video */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Demo Video</h2>
        <div className="aspect-video">
          <video controls className="w-full rounded-lg shadow-lg">
            <source src="/demo/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

    

      {/* Installation
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Installation</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <code>
            git clone https://github.com/anjupavithran123/api_frontend.git{'\n'}
            cd api_frontend{'\n'}
            npm install{'\n'}
            npm run dev
          </code>
        </pre>
      </section> */}
    </div>
  );
}
