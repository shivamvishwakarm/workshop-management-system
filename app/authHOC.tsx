"use client";

import React, { useState, useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    return function AuthenticatedComponent(props: any) {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState("");
        const [isClient, setIsClient] = useState(false);

        const HARDCODED_USERNAME = "admin";
        const HARDCODED_PASSWORD = "password";

        useEffect(() => {
            setIsClient(true);
            // Check if user is already logged in
            const storedAuth = localStorage.getItem("isLoggedIn");
            if (storedAuth === "true") {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }, []);

        const handleLogin = (e: React.FormEvent) => {
            e.preventDefault();
            if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
                localStorage.setItem("isLoggedIn", "true");
                setIsAuthenticated(true);
                setError("");
            } else {
                setError("Invalid username or password");
            }
        };

        const handleLogout = () => {
            localStorage.removeItem("isLoggedIn");
            setIsAuthenticated(false);
        }

        // Prevent hydration mismatch by rendering null until client-side
        if (!isClient) {
            return null; // Or a server-safe loading placeholder if preferred
        }

        // Pass logout handler to wrapped component if needed
        const propsWithLogout = { ...props, logout: handleLogout };

        if (isLoading) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-50">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <div className="text-slate-500 text-sm font-medium">Loading...</div>
                    </div>
                </div>
            );
        }

        if (isAuthenticated) {
            return <WrappedComponent {...propsWithLogout} />;
        }

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 transition-all">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Please sign in to access the application
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-slate-900"
                                >
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 transition-shadow"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-slate-900"
                                >
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 transition-shadow"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-inset ring-red-600/10 border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-[0.98]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        );
    };
};

export default withAuth;
