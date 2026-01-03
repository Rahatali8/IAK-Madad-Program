import { Heart } from "lucide-react"

interface LoginSidebarProps {
  title?: string
  description?: string
  stats?: Array<{ label: string; value: string }>
}

export default function LoginSidebar({
  title = "Himayyat By Idara Al-khair",
  description = "Empowering communities with transparent welfare support and donor-driven initiatives.",
  stats = [
    { label: "Applications", value: "10K+" },
    { label: "Satisfaction", value: "95%" }
  ]
}: LoginSidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] text-white relative overflow-hidden rounded-lg items-center justify-center m-10 p-12">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-lg space-y-8">
        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
          <Heart className="h-8 w-8 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-extrabold leading-tight">{title}</h1>
        <p className="text-lg text-gray-200">{description}</p>
        <div className="grid grid-cols-2 gap-6 pt-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-white/10 rounded-2xl backdrop-blur shadow-lg">
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
