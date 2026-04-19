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

  // Stats
  const stats = [
    { value: "2000+", label: "Farmers Connected" },
    { value: "1000+", label: "Equipment Listed" },
    { value: "10+", label: "Regions Covered" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  // Services
  const services = [
    "Equipment Rental Marketplace",
    "Verified Listings",
    "Affordable Pricing",
    "Farmer Support",
  ];

  // Team

  // Values
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
    <div className="bg-base-100 text-base-content">
      {/* HERO */}
      <section className="py-16 bg-green-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-700">
              Empowering Farmers with Smart Solutions
            </h1>
            <p className="mt-4 text-lg max-w-xl">
              FarmBazaar connects farmers with affordable equipment through a
              simple rental marketplace, making modern agriculture accessible.
            </p>
            <button className="btn btn-success mt-6">
              Get Started <ChevronRight size={18} />
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1625246335525-4d50d5dd0c9d"
            className="rounded-lg shadow-lg"
            alt="farmer"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-green-700 text-white py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          {stats.map((s, i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold">{s.value}</h2>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Our Story</h2>
        <p>
          Founded in 2026, FarmBazaar was created to help farmers access modern
          equipment without heavy investment.
        </p>
        <p className="mt-3">
          Today, we connect thousands of farmers and equipment owners, improving
          productivity and reducing costs.
        </p>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-green-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-8">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="p-6 bg-base-100 shadow rounded-lg">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 bg-green-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            Our Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className={`p-6 rounded-lg shadow cursor-pointer ${
                  active === i ? "bg-green-200" : "bg-base-100"
                }`}
              >
                <div className="mb-3">{v.icon}</div>
                <h3 className="font-bold">{v.title}</h3>
                <p className="text-sm mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          What Farmers Say
        </h2>
        <div className="p-6 shadow rounded-lg bg-base-100">
          <p className="italic">
            "This platform helped me access a tractor without buying one. My
            yield increased significantly."
          </p>
          <h4 className="mt-4 font-bold">— Ramesh Patel</h4>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join FarmBazaar</h2>
        <p className="mb-6">Start renting or listing equipment today.</p>
        <button onClick={() => navigate("/signup")} className="btn btn-accent">
          Register Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-base-200">
        <p>FarmBazaar © {new Date().getFullYear()}</p>
        <p className="text-sm">Empowering Farmers Across India</p>
      </footer>
    </div>
  );
};

export default About;
