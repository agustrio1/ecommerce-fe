import { Metadata } from "next";
import HubungiKamiForm from "@/components/email/HubungiKamiForm";
import HubungiKamiInfo from "@/components/email/HubungiKamiInfo";

export const metadata: Metadata = {
  title: "Hubungi Kami | Agus Store",
  description:
    "Hubungi tim kami untuk pertanyaan, saran, atau bantuan. Kami siap membantu Anda.",
};

export default function HubungiKami() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Hubungi Kami
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika
            Anda memiliki pertanyaan atau membutuhkan bantuan.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <HubungiKamiInfo />
            <HubungiKamiForm />
          </div>
        </div>

        <div className="mt-20">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Lokasi Kami
              </h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1390948797302!2d111.903059673805!3d-7.775072077131152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7853694e7c0c6f%3A0xfc2e8080637364ce!2sDusun%20Kalibago%2C%20Desa%20Kalipang%2C%20Kecamatan%20Grogol%2C%20Kabupaten%20Kediri!5e0!3m2!1sid!2sid!4v1736673116358!5m2!1sid!2sid"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
