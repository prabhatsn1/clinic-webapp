import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Blog",
  description:
    "Health insights and medical tips from the specialists at MedVita Clinic.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            Health Insights
          </Badge>
          <h1 className="text-5xl font-bold mb-4">The MedVita Blog</h1>
          <p className="text-xl text-brand-100/75">
            Expert health tips written by our own specialists.
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.08}>
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="h-full flex flex-col group overflow-hidden p-0">
                  <div className="h-44 bg-brand-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={600}
                      height={176}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Badge variant="brand" className="mb-3 self-start">
                      {post.category}
                    </Badge>
                    <h2 className="font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 flex-1 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{post.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.read_time_minutes} min read
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
