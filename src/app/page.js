import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section class="text-gray-600 body-font">
        <div class="container mx-auto flex px-5 pt-6 md:flex-row flex-col items-center">
          <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-2 md:mb-0 items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Inventory Hub -
              <br class="hidden lg:inline-block" />
              The Ultimate API for Seamless Inventory Management
            </h1>
            <h2 class="text-2xl font-semibold text-gray-800 mt-6">
              Effortlessly Manage Your Inventory with Inventory Hub
            </h2>
            <p class="text-gray-700 mt-4">
              Inventory Hub is a cutting-edge API designed to streamline and
              optimize your inventory management processes. Whether you’re a
              small business or a large enterprise, Inventory Hub provides
              robust features to ensure your inventory operations run smoothly
              and efficiently. With a focus on simplicity, security, and
              scalability, Inventory Hub is your go-to solution for all your
              inventory needs.
            </p>

            <h2 class="text-2xl font-semibold text-gray-800 mt-6">
              Key Features:
            </h2>
            <ul class="list-disc list-inside text-gray-700 mt-4">
              <li>
                <strong>User Authentication:</strong> Secure and reliable user
                authentication to protect your data and ensure that only
                authorized personnel have access to your inventory system.
              </li>
              <li>
                <strong>Category Management:</strong> Efficiently organize and
                manage your inventory items into categories for easy tracking
                and retrieval.
              </li>
              <li>
                <strong>Supplier Management:</strong> Maintain detailed records
                of your suppliers, manage relationships, and streamline your
                procurement process.
              </li>
              <li>
                <strong>Inventory Transactions:</strong> Track all inventory
                movements, including additions, deductions, and transfers, with
                precise transaction logging and reporting.
              </li>
              <li>
                <strong>Purchase Orders:</strong> Simplify your procurement
                process by creating, managing, and tracking purchase orders with
                ease.
              </li>
              <li>
                <strong>Create Invoices:</strong> Generate professional invoices
                quickly and accurately to ensure timely payments and clear
                communication with your clients.
              </li>
            </ul>

            <p class="text-gray-700 mt-6">
              Inventory Hub is more than just an API; it’s a comprehensive tool
              designed to make inventory management hassle-free and efficient.
              Experience the power of seamless inventory management with
              Inventory Hub and take your business operations to the next level.
            </p>
            <div class="flex justify-center pt-8">
              <button class="inline-flex text-white bg-red-500 border-0 pt-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">
                Button
              </button>
              <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Button
              </button>
            </div>
          </div>
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              class="object-cover object-top rounded"
              alt="hero"
              src="/SR_log01.jpg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
