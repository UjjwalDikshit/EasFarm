import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tractor, Users, Target, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const theme = useSelector((state) => state.theme.mode);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const stats = [
    { value: "2000+", label: "Farmers Connected" },
    { value: "1000+", label: "Equipment Listed" },
    { value: "10+", label: "Regions Covered" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  const services = [
    "Equipment Rental Marketplace",
    "Verified Listings",
    "Affordable Pricing",
    "Farmer Support",
  ];

  const values = [
    {
      title: "Farmer First",
      desc: "Focused on improving farmers’ lives.",
      icon: <Users />,
    },
    {
      title: "Affordability",
      desc: "Low-cost access to modern equipment.",
      icon: <Star />,
    },
    {
      title: "Trust",
      desc: "Transparent and reliable platform.",
      icon: <Target />,
    },
    {
      title: "Innovation",
      desc: "Constantly improving with tech.",
      icon: <Tractor />,
    },
  ];

  return (
    <div className="bg-base-100 text-base-content transition-colors duration-300">
      {/* HERO */}
      <section className="py-16 bg-base-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Empowering Farmers with Smart Solutions
            </h1>
            <p className="mt-4 text-lg max-w-xl text-base-content/80">
              FarmBazaar connects farmers with affordable equipment through a
              simple rental marketplace, making modern agriculture accessible.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-primary mt-6 flex items-center gap-2"
            >
              Get Started <ChevronRight size={18} />
            </button>
          </div>
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQEf9fbVptOwmQ/profile-displayphoto-scale_400_400/B56Zk6KSpPJwAk-/0/1757617402183?e=1778112000&v=beta&t=mFfE_gvfwUJZbm2nhutymqC-sYmcvzctRsblzv_IwSo"
            className="rounded-lg shadow-lg"
            alt="farmer"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-primary-content py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          {stats.map((s, i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold">{s.value}</h2>
              <p className="text-sm opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
        <p className="text-base-content/80">
          Founded in 2026, FarmBazaar was created to help farmers access modern
          equipment without heavy investment.
        </p>
        <p className="mt-3 text-base-content/70">
          Today, we connect thousands of farmers and equipment owners, improving
          productivity and reducing costs.
        </p>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-base-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="p-6 bg-base-100 shadow rounded-lg border border-base-200"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 bg-base-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-10">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className={`p-6 rounded-lg shadow cursor-pointer transition ${
                  active === i
                    ? "bg-primary text-primary-content"
                    : "bg-base-100"
                }`}
              >
                <div className="mb-3">{v.icon}</div>
                <h3 className="font-bold">{v.title}</h3>
                <p className="text-sm mt-2 opacity-80">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">
          What Farmers Say
        </h2>
        <div className="p-6 shadow rounded-lg bg-base-100 border border-base-200">
          <p className="italic text-base-content/80">
            "This platform helped me access a tractor without buying one. My
            yield increased significantly."
          </p>
          <h4 className="mt-4 font-bold">— Ramesh Patel</h4>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-content text-center">
        <h2 className="text-3xl font-bold mb-4">Join FarmBazaar</h2>
        <p className="mb-6 opacity-90">
          Start renting or listing equipment today.
        </p>
        <button onClick={() => navigate("/signup")} className="btn btn-accent">
          Register Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-base-200">
        <p>FarmBazaar © {new Date().getFullYear()}</p>
        <p className="text-sm opacity-70">Empowering Farmers Across India</p>
      </footer>
    </div>
  );
};

export default About;
