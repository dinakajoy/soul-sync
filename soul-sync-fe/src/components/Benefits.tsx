import { Sparkles, Mic, Brain } from "lucide-react";

const benefits = [
  {
    icon: <Sparkles className="w-8 h-8 text-purple-500" />,
    title: "Understand your emotions",
  },
  {
    icon: <Mic className="w-8 h-8 text-purple-500" />,
    title: "Journaling + Check-ins",
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-500" />,
    title: "AI-powered personal reflection",
  },
];

export default function Benefits() {
  return (
    <section className="py-20 bg-white text-center">
      <h2 className="text-3xl font-semibold mb-10 text-purple-700">Key Benefits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 px-4 max-w-6xl mx-auto">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-4 p-6 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            {benefit.icon}
            <p className="text-lg font-medium text-gray-700">{benefit.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
