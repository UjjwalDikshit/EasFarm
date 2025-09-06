import React, { useState } from 'react';
import { 
  Tractor, 
  Sprout, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Star, 
  MapPin, 
  Globe, 
  Lightbulb,
  ChevronRight,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const About = () => {
  const [activeValue, setActiveValue] = useState(0);

  // Team data
  const teamMembers = [
    {
      name: "Ujjwal Dikshit",
      role: "Founder & CEO",
      bio: "Passionate about transforming agriculture through technology and innovation.",
      funFact: "Grew up on a family farm in Bihar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      name: "Priya Sharma",
      role: "Agricultural Expert",
      bio: "10+ years experience in modern farming techniques and crop management.",
      funFact: "Holds a PhD in Agricultural Science",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      name: "Rajesh Kumar",
      role: "Technology Head",
      bio: "Expert in building scalable platforms that connect rural communities.",
      funFact: "Built his first app at age 16",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      name: "Anjali Singh",
      role: "Community Manager",
      bio: "Dedicated to ensuring farmers get the most value from our platform.",
      funFact: "Organizes farmer workshops across Bihar",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Company values
  const values = [
    {
      title: "Empowerment",
      description: "We empower farmers with technology to increase productivity and profitability.",
      icon: <Lightbulb size={24} />
    },
    {
      title: "Accessibility",
      description: "Making farm equipment accessible and affordable to every farmer.",
      icon: <Star size={24} />
    },
    {
      title: "Community",
      description: "Building a supportive network of farmers and service providers.",
      icon: <Users size={24} />
    },
    {
      title: "Innovation",
      description: "Continually improving our platform to serve the agricultural community better.",
      icon: <Target size={24} />
    }
  ];

  // Stats data
  const stats = [
    { value: "2,500+", label: "Happy Farmers" },
    { value: "1,200+", label: "Equipment Listings" },
    { value: "15+", label: "Districts Served" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "This platform helped me access a tractor at half the cost of buying one. My yield has increased by 40% since I started using modern equipment.",
      author: "Ramesh Patel",
      position: "Farmer from Nalanda",
      avatar: "https://images.unsplash.com/photo-1627907228175-9c3eff5e6e50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      quote: "I was able to monetize my equipment during off-seasons. This platform has become an additional source of income for my family.",
      author: "Vikram Singh",
      position: "Equipment Owner",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <>
        <div className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-800 dark:text-green-200">
                    Empowering <span className="text-green-600 dark:text-green-400">Farmers</span>, Transforming Agriculture
                </h1>
                <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                    Kisan Saathi is a platform connecting farmers with equipment providers. We make modern farming tools accessible and affordable through our rental and purchase marketplace, helping increase productivity and profitability for farming communities across Bihar.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="btn btn-success btn-lg">
                    Join Our Platform <ChevronRight size={20} />
                    </button>
                    <button className="btn btn-outline btn-success btn-lg">
                    Learn More
                    </button>
                </div>
                </div>
                <div className="flex-1">
                <img 
                    src="https://images.unsplash.com/photo-1625246335525-4d50d5dd0c9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                    alt="Farmer with tractor" 
                    className="rounded-lg shadow-2xl"
                />
                </div>
            </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-green-700 text-green-50">
            <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Origin Story */}
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-200">Our Story</h2>
                <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                <div className="text-lg leading-relaxed space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                    Kisan Saathi was founded in 2020 by Ujjwal Dikshit, who grew up witnessing the challenges faced by farmers in rural Bihar. 
                    He saw how small and marginal farmers struggled to access modern farming equipment due to high costs and limited availability.
                    </p>
                    <p>
                    What started as a simple idea to connect equipment owners with farmers has grown into a comprehensive platform that serves 
                    thousands of users across multiple districts. We're proud to be contributing to the modernization of agriculture in Bihar.
                    </p>
                    <p>
                    Our mission is to make farming more profitable and sustainable by providing access to technology, knowledge, and resources 
                    that were previously out of reach for many farmers.
                    </p>
                </div>
                </div>
                
                <div className="flex-1">
                <div className="card bg-base-100 shadow-xl">
                    <figure>
                    <img 
                        src="https://images.unsplash.com/photo-1592496431122-2349a0f8fae9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                        alt="Farmers discussing" 
                        className="h-64 w-full object-cover"
                    />
                    </figure>
                    <div className="card-body">
                    <h3 className="card-title text-green-800 dark:text-green-200">Our Impact</h3>
                    <p>Helping farmers increase yields and reduce costs through equipment sharing</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-green-50 dark:bg-gray-800">
            <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-200">Our Team</h2>
                <p className="text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                Dedicated professionals working to transform agriculture in Bihar
                </p>
                <div className="w-20 h-1 bg-green-600 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                <div key={index} className="card bg-base-100 shadow-lg overflow-hidden">
                    <figure className="px-6 pt-6">
                    <div className="avatar">
                        <div className="w-32 rounded-full">
                        <img src={member.avatar} alt={member.name} />
                        </div>
                    </div>
                    </figure>
                    <div className="card-body items-center text-center">
                    <h3 className="card-title text-green-800 dark:text-green-200">{member.name}</h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">{member.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
                    <div className="card-actions justify-end mt-4">
                        <div className="badge badge-outline badge-success">{member.funFact}</div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-200">Our Values</h2>
                <p className="text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                The principles that guide everything we do
                </p>
                <div className="w-20 h-1 bg-green-600 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                <div 
                    key={index} 
                    className={`card ${activeValue === index ? 'bg-green-100 dark:bg-green-900' : 'bg-base-100'} shadow-md transition-all duration-300 cursor-pointer border border-green-200 dark:border-green-800`}
                    onMouseEnter={() => setActiveValue(index)}
                >
                    <div className="card-body items-center text-center">
                    <div className={`p-4 rounded-full ${activeValue === index ? 'bg-green-200 dark:bg-green-700' : 'bg-green-100 dark:bg-green-900'}`}>
                        {React.cloneElement(value.icon, { 
                        className: activeValue === index ? 'text-green-700 dark:text-green-200' : 'text-green-600 dark:text-green-400'
                        })}
                    </div>
                    <h3 className="card-title text-green-800 dark:text-green-200">{value.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-green-50 dark:bg-gray-800">
            <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-200">What Our Users Say</h2>
                <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                <div key={index} className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                    <div className="flex items-start gap-2 mb-4">
                        <div className="text-green-600">
                        <Heart size={24} fill="currentColor" />
                        </div>
                        <p className="text-lg italic text-gray-700 dark:text-gray-300">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="avatar">
                        <div className="w-12 rounded-full">
                            <img src={testimonial.avatar} alt={testimonial.author} />
                        </div>
                        </div>
                        <div>
                        <h4 className="font-bold text-green-800 dark:text-green-200">{testimonial.author}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-200">Our Headquarters</h2>
                <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10 items-center">
                <div className="flex-1">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                    <h3 className="card-title text-green-800 dark:text-green-200">Visit Us</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                        <MapPin className="text-green-600" size={24} />
                        <div>
                            <p className="font-medium">Address</p>
                            <p className="text-gray-700 dark:text-gray-300">123 Farmer Road, Agricultural Zone, Patna, Bihar 800001</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <Phone className="text-green-600" size={24} />
                        <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-gray-700 dark:text-gray-300">+91 98765 43210</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <Mail className="text-green-600" size={24} />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-gray-700 dark:text-gray-300">contact@kisansathi.com</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <Calendar className="text-green-600" size={24} />
                        <div>
                            <p className="font-medium">Business Hours</p>
                            <p className="text-gray-700 dark:text-gray-300">Mon-Sat: 9AM-6PM</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
                <div className="flex-1 h-96">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.58258367115!2d85.0784054540366!3d25.61259090000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1710863944298!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, borderRadius: "8px" }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Location in Patna, Bihar"
                ></iframe>
                </div>
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-green-700 text-green-50">
            <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Agricultural Revolution</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
                Whether you're a farmer looking for equipment or an owner wanting to monetize your assets, we have a solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-accent btn-lg">
                Register Now <ChevronRight size={20} />
                </button>
                <button className="btn btn-outline btn-lg text-green-50 border-green-50">
                Learn More
                </button>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="footer footer-center p-10 bg-base-200 text-base-content">
            <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Services</a>
            <a className="link link-hover">FAQ</a>
            </div> 
            <div>
            <div className="grid grid-flow-col gap-4">
                <a className="text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
                </a>
                <a className="text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
                </a>
                <a className="text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
                </a>
            </div>
            </div>
            <div>
            <p className="font-bold text-green-800 dark:text-green-200">
                Kisan Saathi <br />Connecting farmers with equipment providers since 2020
            </p>
            <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
            </div>
            <div>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin size={16} className="text-green-600" />
                <span>123 Farmer Road, Patna, Bihar 800001, India</span>
            </p>
            </div>
        </footer>
        </div>
    </>
  );
};

export default About;
