import { ShoppingBag, TrendingUp, Percent, Award } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  { icon: ShoppingBag, title: "Pilihan Terlengkap", description: "Ribuan produk tersedia untuk Anda", color: "bg-blue-500" },
  { icon: TrendingUp, title: "Trending Saat Ini", description: "Produk yang sedang banyak diminati", color: "bg-green-500" },
  { icon: Percent, title: "Harga Terbaik", description: "Harga yang terbaik untuk Anda, tanpa biaya tambahan", color: "bg-yellow-500" },
  { icon: Award, title: "Kualitas Terjamin", description: "Produk unggulan dengan jaminan mutu", color: "bg-purple-500" },
];

function FeatureSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Keunggulan Kami</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nikmati pengalaman berbelanja terbaik bersama kami. Kami menawarkan berbagai keuntungan untuk memenuhi kebutuhan Anda.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-16 h-16 flex items-center justify-center rounded-full text-white", feature.color)}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </CardContent>
              <div className={cn("h-1 w-full", feature.color)} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;

