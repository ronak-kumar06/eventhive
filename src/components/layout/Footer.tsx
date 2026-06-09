import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-background/50 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8FAD88] to-[#C1D5C0] flex items-center justify-center">
                <span className="text-zinc-900 font-bold">E</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                EventSphere
              </span>
            </Link>
            <p className="text-sm text-zinc-600">
              The premium Event & Media Management platform for modern clubs and societies.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-900">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><span className="opacity-50 cursor-not-allowed">Features</span></li>
              <li><Link href="/pricing" className="hover:text-zinc-900 transition">Pricing</Link></li>
              <li><Link href="/gallery" className="hover:text-zinc-900 transition">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-zinc-900">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><span className="opacity-50 cursor-not-allowed">Documentation</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Help Center</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Blog</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-zinc-900">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><span className="opacity-50 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} EventSphere AI. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="opacity-50 cursor-not-allowed">Twitter</span>
            <span className="opacity-50 cursor-not-allowed">GitHub</span>
            <span className="opacity-50 cursor-not-allowed">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
