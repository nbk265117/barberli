"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { Scissors, User, LogOut, LogIn } from "lucide-react";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BarberLi</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/barbershops" className="text-gray-600 hover:text-gray-900">
              Barbershops
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Mon compte</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
