import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | Agus Store",
  description:
    "Kenali lebih jauh Agus Store, e-commerce yang menyediakan produk terbaik dengan pelayanan terpercaya untuk pelanggan setia kami.",
};

export default function TentangKami() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Tentang Agus Store
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Agus Store adalah toko online terpercaya yang berdedikasi untuk
            menyediakan produk berkualitas dengan harga yang bersahabat untuk
            memenuhi kebutuhan Anda.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Visi Kami",
                description:
                  "Menjadi toko online pilihan utama bagi masyarakat Indonesia dalam mendapatkan produk berkualitas untuk kebutuhan sehari-hari.",
                icon: "🚀",
              },
              {
                title: "Misi Kami",
                description:
                  "Menyediakan produk terbaik dengan harga terjangkau serta pelayanan cepat dan terpercaya untuk kenyamanan belanja Anda.",
                icon: "🎯",
              },
              {
                title: "Nilai-Nilai Kami",
                description:
                  "Kepercayaan, kualitas, kepuasan pelanggan, dan komitmen adalah inti dari layanan yang kami berikan.",
                icon: "💎",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-lg font-medium text-gray-900 truncate">
                        {item.title}
                      </dt>
                    </div>
                  </div>
                  <dd className="mt-2 text-base text-gray-500">
                    {item.description}
                  </dd>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Tim Agus Store
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Orang-Orang Hebat di Balik Layanan Kami
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: "Agus Wijaya",
                  role: "Founder & CEO",
                  image: "/person.png?height=400&width=400",
                  bio: "Agus memimpin Agus Store dengan visi untuk memberikan pengalaman belanja online yang terpercaya dan memuaskan.",
                },
                {
                  name: "Dewi Lestari",
                  role: "COO",
                  image: "/single-person.png?height=400&width=400",
                  bio: "Dewi bertanggung jawab memastikan setiap operasi berjalan lancar untuk kepuasan pelanggan kami.",
                },
                {
                  name: "Budi Santoso",
                  role: "Kepala Layanan Pelanggan",
                  image: "/person.png?height=400&width=400",
                  bio: "Budi memastikan setiap pelanggan mendapatkan pengalaman berbelanja yang terbaik dengan dukungan cepat dan solutif.",
                },
                {
                  name: "Siti Rahayu",
                  role: "Kepala Teknologi",
                  image: "/single-person.png?height=400&width=400",
                  bio: "Siti mengembangkan teknologi inovatif untuk memberikan pengalaman belanja yang mudah dan aman.",
                },
              ].map((person, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden">
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm text-blue-600">{person.role}</p>
                    <p className="mt-2 text-base text-gray-500">{person.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
