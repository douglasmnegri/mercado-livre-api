"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import logo from "../public/logo-click-camisetas.png";
import illustration from "../public/login-illustration.png";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("authToken", data.token);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao fazer login!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro na requisição. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#a3ff00]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-[#7bc700]/15 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-8 w-16 h-16 bg-[#a3ff00]/20 rounded-full blur-md"></div>
        </div>

        <div className="max-w-md relative z-10">
          <Image
            src={illustration}
            alt="Login Illustration"
            width={500}
            height={500}
            className="w-full h-auto drop-shadow-lg"
          />
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Bem-vindo ao Dashboard
            </h2>
            <p className="text-lg text-gray-600">
              Gerencie seus produtos e vendas de forma simples e eficiente
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#a3ff00] rounded-full"></div>
              <div className="w-2 h-2 bg-[#7bc700] rounded-full"></div>
              <div className="w-2 h-2 bg-[#a3ff00] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-lg border-0 shadow-lg">
          <div className="relative flex h-16 w-full items-center justify-center bg-[#a3ff00] rounded-t-lg lg:hidden">
            <div className="absolute -top-12">
              <Image
                src={logo}
                alt="Click Camisetas Logo"
                width={100}
                height={100}
                className="drop-shadow-md"
              />
            </div>
          </div>
          <CardHeader className="space-y-1 pt-8 lg:pt-6">
            <div className="hidden lg:flex justify-center mb-4">
              <Image
                src={logo}
                alt="Click Camisetas Logo"
                width={80}
                height={80}
                className="drop-shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Dashboard ML
            </CardTitle>
            <CardDescription className="text-center">
              Insira suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus-visible:ring-[#a3ff00] focus-visible:ring-offset-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-gray-500 hover:text-[#7bc700]"
                    type="button"
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-200 focus-visible:ring-[#a3ff00] focus-visible:ring-offset-0"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="sr-only">
                      {showPassword ? "Ocultar senha" : "Mostrar senha"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full h-11 bg-[#a3ff00] text-black hover:bg-[#7bc700] transition-colors"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                    <span className="ml-2">Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </div>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                © {new Date().getFullYear()} Click Camisetas. Todos os direitos
                reservados.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
