"use client";

import { signIn } from "@/app/reqHandlers/signin.reqHandler";
import React, { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState<number>(-1);
  const [password, setPassword] = useState("");

  const handleOnClickSignIn = async(e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
        const res = await signIn(email, password);
  
        if (res?.success) {
          // redirect or show success
        } else {
          // handle error
        }
    }catch(e){

    }
  
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background text-foreground">
      <div className="w-full max-w-md bg-white/10 dark:bg-black/30 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-secondary/30">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleOnClickSignIn}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-secondary/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-secondary/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-secondary">
          Don’t have an account?{" "}
          <a href="/signup" className="text-secondary font-bold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
