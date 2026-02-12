"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { about_me } from "../../utils/constants";
import profile from "../../public/images/me-s.jpg";

const hobbies = [
  {
    name: "Cricket",
    icon: "noto-v1:cricket-game",
    description: "Enjoying occasional matches for fun and team bonding",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Music",
    icon: "noto-v1:musical-score",
    description: "Exploring various genres to fuel creativity and focus",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Photography",
    icon: "noto-v1:camera-with-flash",
    description: "Capturing moments and planning to pursue it professionally",
    color: "from-blue-500 to-cyan-500",
  },
];

const values = [
  {
    icon: "solar:lightbulb-bolt-bold-duotone",
    title: "Innovation",
    description: "Always exploring new technologies and pushing boundaries",
  },
  {
    icon: "solar:users-group-rounded-bold-duotone",
    title: "Collaboration",
    description: "Believing in the power of teamwork to achieve greatness",
  },
  {
    icon: "solar:star-bold-duotone",
    title: "Excellence",
    description: "Committed to delivering quality in every project",
  },
  {
    icon: "solar:book-bold-duotone",
    title: "Learning",
    description: "Continuously growing and adapting to stay ahead",
  },
];

export default function AboutPage() {
  return (
    <main className="relative pt-20">
      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-violet-400 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" />
              Back to Home
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-primary mb-4">About Me</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get to Know <span className="gradient-text">Me Better</span>
              </h1>
              <p className="text-white/70 leading-relaxed text-lg mb-8">
                {about_me}
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary">
                  <Icon icon="solar:chat-round-dots-bold" />
                  Let&apos;s Connect
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  className="btn-secondary"
                >
                  <Icon icon="solar:document-bold" />
                  Download CV
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative glass rounded-3xl p-2">
                  <Image
                    src={profile}
                    alt="Umar Suhail"
                    width={400}
                    height={400}
                    className="rounded-2xl object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white/[0.02]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-primary mb-4">Core Values</span>
            <h2 className="section-title text-white">
              What <span className="gradient-text">Drives Me</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center card-hover"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                  <Icon icon={value.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-white/60 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-primary mb-4">Beyond Work</span>
            <h2 className="section-title text-white">
              Hobbies & <span className="gradient-text">Interests</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => (
              <motion.div
                key={hobby.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden card-hover"
              >
                <div className={`h-32 bg-gradient-to-r ${hobby.color} flex items-center justify-center`}>
                  <Icon icon={hobby.icon} className="text-6xl" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {hobby.name}
                  </h3>
                  <p className="text-white/60 text-sm">{hobby.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-violet-600/20 to-purple-600/20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              I&apos;m always excited to work on new projects and collaborate with innovative teams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact" className="btn-primary">
                <Icon icon="solar:chat-round-dots-bold" />
                Start a Conversation
              </Link>
              <Link href="/#projects" className="btn-secondary">
                <Icon icon="solar:eye-bold" />
                View My Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
