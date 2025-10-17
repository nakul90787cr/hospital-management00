import React from "react";
import { ShaderAnimation } from "../components/ui/shader-animation.js";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ShaderDemo() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Shader Animation Background */}
      <ShaderAnimation />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            <Sparkles className="w-6 h-6 text-white/80 animate-pulse delay-75" />
            <Sparkles className="w-8 h-8 text-white animate-pulse delay-150" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none">
            Shader
            <br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Animation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto">
            WebGL powered animations with Three.js
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to={createPageUrl("Dashboard")}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-white/90 shadow-2xl shadow-white/20"
              onClick={() => window.location.reload()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Restart Animation
            </Button>
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap gap-4 justify-center max-w-4xl px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 border border-white/20">
            <p className="text-white/90 text-sm font-medium">Real-time WebGL</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 border border-white/20">
            <p className="text-white/90 text-sm font-medium">60 FPS Animation</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 border border-white/20">
            <p className="text-white/90 text-sm font-medium">Responsive Design</p>
          </div>
        </div>
      </div>
    </div>
  );
}