import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Copy, MessageSquare, Briefcase, Wand2, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Transform AI Text to{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Natural Human Writing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Make your AI-generated content sound authentic and human-like. Choose your style,
              paste your text, and get naturally flowing results in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tool" data-testid="link-try-tool">
              <Button size="lg" className="text-base" data-testid="button-try-free">
                Try It Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base" data-testid="button-see-example">
              See Example
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Trusted by 50,000+ writers worldwide
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Better Writing
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to humanize your AI-generated content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8" data-testid="card-feature-modes">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Multiple Modes</h3>
                <p className="text-muted-foreground">
                  Choose from casual, professional, or creative writing styles to match your needs
                  perfectly.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8" data-testid="card-feature-instant">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get humanized text in seconds with our advanced AI processing. No waiting, just
                  results.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8" data-testid="card-feature-copy">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Copy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Copy & Export</h3>
                <p className="text-muted-foreground">
                  One-click copy to clipboard makes it easy to use your humanized text anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to natural, human-like text
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center space-y-4" data-testid="step-1">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground">Paste Your Text</h3>
              <p className="text-muted-foreground">
                Copy and paste your AI-generated content into the input area.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="step-2">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground">Choose Your Style</h3>
              <p className="text-muted-foreground">
                Select casual, professional, or creative mode based on your audience.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="step-3">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground">Get Results</h3>
              <p className="text-muted-foreground">
                Receive naturally flowing, human-like text in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Transformation */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See The Difference
            </h2>
            <p className="text-lg text-muted-foreground">
              Before and after transformation examples
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6" data-testid="card-before">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <h3 className="text-lg font-semibold text-card-foreground">Before</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "The implementation of the aforementioned strategy will facilitate the optimization
                  of operational efficiency metrics through the systematic integration of advanced
                  technological solutions."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6" data-testid="card-after">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h3 className="text-lg font-semibold text-card-foreground">After</h3>
                </div>
                <p className="text-foreground leading-relaxed">
                  "This strategy will help us work more efficiently by using better technology. It's
                  a straightforward way to improve how we operate day-to-day."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modes Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Style
            </h2>
            <p className="text-lg text-muted-foreground">
              Three modes to match any writing scenario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6" data-testid="card-mode-casual">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Casual</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for blogs, social media, and friendly communications.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  "Hey! This is a really cool way to make your writing sound more natural and
                  conversational."
                </div>
              </CardContent>
            </Card>

            <Card className="p-6" data-testid="card-mode-professional">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Professional</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ideal for business emails, reports, and formal documents.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  "This approach provides an effective method for refining content to maintain
                  professional standards."
                </div>
              </CardContent>
            </Card>

            <Card className="p-6" data-testid="card-mode-creative">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Creative</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great for storytelling, marketing copy, and engaging content.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  "Imagine transforming rigid text into flowing prose that captivates and connects
                  with readers."
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary/10 via-chart-2/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Start Humanizing Your Text
          </h2>
          <p className="text-xl text-muted-foreground">
            Free to use. No signup required. Transform your content in seconds.
          </p>
          <Link href="/tool" data-testid="link-cta-tool">
            <Button size="lg" className="text-base" data-testid="button-cta-start">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 Humanizer AI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
