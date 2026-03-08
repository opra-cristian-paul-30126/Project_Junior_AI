import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                await signIn(email, password)
                toast.success('Welcome back!')
            } else {
                await signUp(email, password)
                toast.success('Account created! Check your email to confirm.')
            }
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-
                full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-
                full blur-3xl" />
            </div>

            <div className="glass-strong p-8 w-full max-w-md relative animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        TripMind
                    </h1>
                    <p className="text-white/60 mt-2">
                        {isLogin ? 'Welcome back, explorer!' : 'Start your journey'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-x1 py-3 pl-10
                                pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50
                                focus:ring-1 focus:ring-primary-500/50 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-x1 py-3 pl-10
                                pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50
                                focus:ring-1 focus:ring-primary-500/50 transition-all"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-primary text-white font-semibold py-3 px-4
                        rounded-xl flex items-center justify-center gap-2 hover:opacity-90
                        transition-opacity disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2
                                border-b-2 border-white" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <p className="text-center text-white/50 mt-6 text-sm">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary-400 hover:text-primary-300 font-medium
                        transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    )
}