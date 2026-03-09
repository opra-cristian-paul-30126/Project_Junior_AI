import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { FiMap, FiPlusCircle, FiList, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()

    const handleSignOut = async () => {
        await signOut()
        queryClient.clear() // Wipes all cached trips/itineraries for the old user
        navigate('/auth')
    }

    const linkClass = (path) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === path
            ? 'bg-white/10 text-white'
            : 'text-white/50 hover:text-white hover:bg-white/5'
        }`

    return (
        <nav className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <FiMap className="text-2xl text-primary-400" />
                    <span className="bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        TripMind
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-2">
                    <Link to="/" className={linkClass('/')}>
                        <FiMap size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link to="/new-trip" className={linkClass('/new-trip')}>
                        <FiPlusCircle size={18} />
                        <span className="hidden sm:inline">New Trip</span>
                    </Link>
                    <Link to="/my-trips" className={linkClass('/my-trips')}>
                        <FiList size={18} />
                        <span className="hidden sm:inline">My Trips</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all ml-2"
                    >
                        <FiLogOut size={18} />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}