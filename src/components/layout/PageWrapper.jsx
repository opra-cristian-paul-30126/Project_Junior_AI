import Navbar from "./Navbar"

export default function PageWrapper({ children }) {
    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}