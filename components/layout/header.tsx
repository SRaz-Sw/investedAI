"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Calculator, TrendingUp, PiggyBank, Building2, Menu, X } from "lucide-react";
import { useTranslationStore } from "@/lib/translations";
import { commonTranslations } from "@/lib/translations/common";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "portfolio", href: "/loan-vs-sell", icon: Calculator },
  { name: "compound", href: "/compound", icon: TrendingUp },
  // { name: "tax", href: "/tax", icon: PieChart },
  { name: "pension", href: "/pension", icon: PiggyBank },
  { name: "realestate", href: "/realestate", icon: Building2 },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, direction } = useTranslationStore();
  const t = commonTranslations[language];
  const [isOpen, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Check if we're on mobile initially
    setIsMobile(window.innerWidth < 768);

    // Add resize listener to update isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add scroll listener for header visibility
    const controlHeader = () => {
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }
      
      const currentScrollY = window.scrollY;
      
      // Only hide header after scrolling down at least 20px
      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', controlHeader);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  // Extract the base path without language prefix
  const basePath = pathname.split('/').slice(2).join('/');

  // Prefetch all routes on mount
  React.useEffect(() => {
    const prefetchRoutes = () => {
      navigation.forEach((item) => {
        const href = `/${language}${item.href}`;
        router.prefetch(href);
      });
    };

    prefetchRoutes();
  }, [language, router]);

  const toggleMenu = React.useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  // New helper function to determine active state
  const isRouteActive = React.useCallback((itemHref: string) => {
    // Remove leading slash and split into segments
    const itemPath = itemHref.replace('/', '');
    // Compare with basePath, also handling the home page case
    return basePath.includes(itemPath) ;
  }, [basePath]);

  if (!mounted) {
    return null;
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-transform duration-300 theme-transition",
        isMobile && !isVisible && !isOpen ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container relative flex h-14 items-center justify-between mx-auto theme-transition" dir={direction()}>
        {/* Logo */}
        <div className="flex items-center gap-4 px-2 py-1 border-b-2 hover:border-b-0 hover:border-primary/50 rounded-md theme-transition">
          <Link href={`/${language}`} className="flex items-center space-x-2" prefetch={true}>
          <span className="font-semibold mx-3 theme-transition">Invested</span>
            <LogoIcon className="h-6 w-6" />

          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex theme-transition">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => {
                const Icon = item.icon;
                const href = `/${language}${item.href}`;
                const isActive = isRouteActive(item.href);
                
                return (
                  <NavigationMenuItem key={item.href}>
                    <Link href={href} legacyBehavior passHref prefetch={true}>
                      <NavigationMenuLink
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors hover:text-foreground/80 theme-transition ${
                          isActive ? "text-foreground font-semibold" : "text-foreground font-medium"
                        }`}
                      >
                        <Icon className={`${isActive ? "h-5 w-5 stroke-[2.5]" : "h-4 w-4 stroke-[1.5]"} theme-transition`} />
                        <span className="theme-transition">{t[item.name]}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Theme and Language Toggles */}
        <div className="flex items-center space-x-2 theme-transition">
          <LanguageToggle />
          <ModeToggle />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden theme-transition"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-5 w-5 theme-transition" /> : <Menu className="h-5 w-5 theme-transition" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-[3.5rem] left-0 right-0 border-b bg-background p-4 md:hidden theme-transition">
            <nav className="flex flex-col space-y-3 theme-transition">
              {navigation.map((item) => {
                const Icon = item.icon;
                const href = `/${language}${item.href}`;
                const isActive = isRouteActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={href}
                    prefetch={true}
                    className={`flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm transition-colors relative theme-transition ${
                      isActive 
                        ? "bg-accent/50 font-semibold after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-primary after:rounded-full" 
                        : "font-medium hover:bg-accent/30"
                    }`}
                    onClick={toggleMenu}
                  >
                    <Icon className={`${isActive ? "h-5 w-5 stroke-[2.5]" : "h-4 w-4 stroke-[1.5]"} theme-transition`} />
                    <span className="theme-transition">{t[item.name]}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}